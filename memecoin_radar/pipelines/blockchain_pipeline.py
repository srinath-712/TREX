import os
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx
from memecoin_radar.config import WINDOW_MINUTES, WHALE_TX_THRESHOLD_USD

DEX_ROUTERS = {
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',  # Uniswap v2
    '0xe592427a0aece92de3edee1f18e0157c05861564',  # Uniswap v3
}

def _zero_result() -> dict:
    return {
        'curr_whale_count': 0,
        'prev_whale_count': 0,
        'curr_volume_usd': 0.0,
        'prev_volume_usd': 0.0,
        'curr_holder_count': 0,
        'prev_holder_count': 0,
        'buy_sell_ratio': None,
        'source': 'unavailable'
    }

def _get_time_windows():
    now = datetime.now(timezone.utc)
    curr_start = now - timedelta(minutes=WINDOW_MINUTES)
    prev_start = now - timedelta(minutes=2 * WINDOW_MINUTES)
    prev_end = curr_start
    return now, curr_start, prev_start, prev_end

async def _fetch_moralis(token_address: str) -> dict:
    api_key = os.environ['MORALIS_API_KEY']
    base_url = "https://deep-index.moralis.io/api/v2.2"
    headers = {'X-API-Key': api_key}
    
    now, curr_start, prev_start, prev_end = _get_time_windows()
    
    async with httpx.AsyncClient() as client:
        curr_url = f"{base_url}/erc20/{token_address}/transfers?chain=eth&from_date={curr_start.isoformat()}&to_date={now.isoformat()}&limit=500"
        curr_resp = await client.get(curr_url, headers=headers)
        curr_resp.raise_for_status()
        curr_transfers = curr_resp.json().get('result', [])
        
        curr_whale_count = 0
        curr_volume_usd = 0.0
        for t in curr_transfers:
            token_amount = int(t['value']) / 10**18
            usd_value = float(t.get('usdPrice')) if t.get('usdPrice') is not None else token_amount * 1  # fallback: no price feed
            if usd_value > WHALE_TX_THRESHOLD_USD:
                curr_whale_count += 1
            curr_volume_usd += usd_value
            
        prev_url = f"{base_url}/erc20/{token_address}/transfers?chain=eth&from_date={prev_start.isoformat()}&to_date={prev_end.isoformat()}&limit=500"
        prev_resp = await client.get(prev_url, headers=headers)
        prev_resp.raise_for_status()
        prev_transfers = prev_resp.json().get('result', [])
        
        prev_whale_count = 0
        prev_volume_usd = 0.0
        for t in prev_transfers:
            token_amount = int(t['value']) / 10**18
            usd_value = float(t.get('usdPrice')) if t.get('usdPrice') is not None else token_amount * 1  # fallback: no price feed
            if usd_value > WHALE_TX_THRESHOLD_USD:
                prev_whale_count += 1
            prev_volume_usd += usd_value

        buys = sum(1 for t in curr_transfers if t['from_address'].lower() in DEX_ROUTERS)
        sells = sum(1 for t in curr_transfers if t['to_address'].lower() in DEX_ROUTERS)
        buy_sell_ratio = buys / max(sells, 1) if (buys + sells) >= 5 else None

        owners_url = f"{base_url}/erc20/{token_address}/owners?chain=eth"
        owners_resp = await client.get(owners_url, headers=headers)
        owners_resp.raise_for_status()
        curr_holder_count = owners_resp.json().get('total_owners', 0)
        
        prev_holder_count = curr_holder_count  # Moralis does not provide historical holder snapshots; using current as proxy

        return {
            'curr_whale_count': curr_whale_count,
            'prev_whale_count': prev_whale_count,
            'curr_volume_usd': curr_volume_usd,
            'prev_volume_usd': prev_volume_usd,
            'curr_holder_count': curr_holder_count,
            'prev_holder_count': prev_holder_count,
            'buy_sell_ratio': buy_sell_ratio
        }

async def _fetch_alchemy(token_address: str) -> dict:
    api_key = os.environ['ALCHEMY_API_KEY']
    base_url = f"https://eth-mainnet.g.alchemy.com/v2/{api_key}"
    
    now, curr_start, prev_start, prev_end = _get_time_windows()
    
    async with httpx.AsyncClient() as client:
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getLogs",
            "params": [{
                "address": token_address,
                "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
            }],
            "id": 1
        }
        resp = await client.post(base_url, json=payload)
        resp.raise_for_status()
        logs = resp.json().get('result', [])
        
        curr_whale_count = 0
        curr_volume_usd = 0.0
        prev_whale_count = 0
        prev_volume_usd = 0.0
        
        # Computing metrics from log data (simplified scaffold)
        for log in logs:
            pass
            
        curr_holder_count = 0  # not available via eth_getLogs
        prev_holder_count = 0  # not available via eth_getLogs
        buy_sell_ratio = None  # DEX classification not available in Alchemy fallback

        return {
            'curr_whale_count': curr_whale_count,
            'prev_whale_count': prev_whale_count,
            'curr_volume_usd': curr_volume_usd,
            'prev_volume_usd': prev_volume_usd,
            'curr_holder_count': curr_holder_count,
            'prev_holder_count': prev_holder_count,
            'buy_sell_ratio': buy_sell_ratio
        }

async def _fetch_etherscan(token_address: str) -> dict:
    api_key = os.environ['ETHERSCAN_API_KEY']
    base_url = "https://api.etherscan.io/api"
    url = f"{base_url}?module=account&action=tokentx&contractaddress={token_address}&startblock=0&endblock=99999999&sort=desc&apikey={api_key}"
    
    now, curr_start, prev_start, prev_end = _get_time_windows()
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        txs = resp.json().get('result', [])
        
        curr_whale_count = 0
        curr_volume_usd = 0.0
        prev_whale_count = 0
        prev_volume_usd = 0.0
        
        if isinstance(txs, list):
            for tx in txs:
                if 'timeStamp' in tx and 'value' in tx:
                    tx_time = datetime.fromtimestamp(int(tx['timeStamp']), tz=timezone.utc)
                    decimals = int(tx.get('tokenDecimal', 18))
                    token_amount = int(tx['value']) / (10 ** decimals)
                    usd_value = token_amount * 1  # fallback
                    
                    if curr_start <= tx_time <= now:
                        if usd_value > WHALE_TX_THRESHOLD_USD:
                            curr_whale_count += 1
                        curr_volume_usd += usd_value
                    elif prev_start <= tx_time < prev_end:
                        if usd_value > WHALE_TX_THRESHOLD_USD:
                            prev_whale_count += 1
                        prev_volume_usd += usd_value

        curr_holder_count = 0  # not available via Etherscan token tx
        prev_holder_count = 0  # not available via Etherscan token tx
        buy_sell_ratio = None  # DEX classification not available in Etherscan fallback

        return {
            'curr_whale_count': curr_whale_count,
            'prev_whale_count': prev_whale_count,
            'curr_volume_usd': curr_volume_usd,
            'prev_volume_usd': prev_volume_usd,
            'curr_holder_count': curr_holder_count,
            'prev_holder_count': prev_holder_count,
            'buy_sell_ratio': buy_sell_ratio
        }


async def fetch_onchain_data(token_address: str, coin: str) -> dict:
    # Fast-fail if not a valid ETH address to avoid 12s timeout spam
    if not token_address.startswith('0x'):
        print(f"[WARNING] OnChain: '{token_address}' is not a valid ETH address. Skipping APIs.")
        return _zero_result()
        
    try:
        result = await _fetch_moralis(token_address)
        result['source'] = 'moralis'
        return result
    except Exception as e:
        print(f'[ERROR] Moralis failed: {e}')

    try:
        result = await _fetch_alchemy(token_address)
        result['source'] = 'alchemy'
        return result
    except Exception as e:
        print(f'[ERROR] Alchemy failed: {e}')

    try:
        result = await _fetch_etherscan(token_address)
        result['source'] = 'etherscan'
        return result
    except Exception as e:
        print(f'[ERROR] Etherscan failed: {e}')

    return _zero_result()
