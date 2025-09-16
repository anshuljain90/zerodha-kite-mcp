# Zerodha Kite Connect MCP Server

An MCP (Model Context Protocol) server for integrating Zerodha's Kite Connect API with AI assistants like Claude. This server enables AI assistants to execute trades, manage portfolios, and access real-time market data from Indian stock exchanges.

## Features

- **Trading Operations**: Place, modify, and cancel orders
- **Portfolio Management**: View positions, holdings, and margins
- **Market Data**: Get real-time quotes and historical data
- **Order Management**: Track orders and trades
- **User Information**: Access profile and account details

## Prerequisites

1. **Zerodha Trading Account**: You need an active Zerodha trading account
2. **Kite Connect Developer Account**: Register at [Kite Connect](https://developers.kite.trade/)
3. **API Credentials**: Create an app on Kite Connect to obtain:
   - API Key
   - API Secret
4. **2FA Setup**: Enable TOTP-based two-factor authentication on your Zerodha account

## Installation

### Using Docker (Recommended)

```bash
docker pull mcp/zerodha-kite
```

### From Source

```bash
git clone https://github.com/anshuljain90/zerodha-kite-mcp.git
cd zerodha-kite-mcp
npm install
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file with your credentials:

```env
KITE_API_KEY=your_api_key_here
KITE_API_SECRET=your_api_secret_here
KITE_ACCESS_TOKEN=your_access_token_here  # Optional, can be generated at runtime
KITE_REDIRECT_URL=http://localhost:3000/redirect
```

### Docker Desktop Integration

1. Open Docker Desktop with MCP Toolkit enabled
2. Import the Zerodha Kite MCP server
3. Configure your API credentials in the settings
4. Enable the server and connect it to your AI assistant

## Authentication Flow

The Kite Connect API uses OAuth 2.0:

1. **Generate Login URL**: Use your API key to create a login URL
2. **User Authorization**: User logs in and authorizes the app
3. **Receive Request Token**: Get the request token from the redirect
4. **Exchange for Access Token**: Use API secret to get access token
5. **API Access**: Use access token for all API calls

## Available Tools

### Trading
- `place_order` - Place buy/sell orders
- `modify_order` - Modify pending orders
- `cancel_order` - Cancel pending orders

### Portfolio
- `get_positions` - View open positions
- `get_holdings` - View demat holdings
- `get_margins` - Check available margins

### Market Data
- `get_quote` - Get real-time quotes
- `get_historical_data` - Get historical OHLC data
- `get_instruments` - List tradeable instruments
- `get_ltp` - Get last traded prices

### Order Management
- `get_orders` - View all orders
- `get_trades` - View executed trades
- `get_order_history` - Get order modification history

### Account
- `get_profile` - Get user profile
- `get_market_status` - Check if markets are open

## Usage Examples

### Place a Market Order
```javascript
{
  "tool": "place_order",
  "arguments": {
    "exchange": "NSE",
    "tradingsymbol": "RELIANCE",
    "transaction_type": "BUY",
    "quantity": 10,
    "order_type": "MARKET",
    "product": "CNC"
  }
}
```

### Get Current Holdings
```javascript
{
  "tool": "get_holdings",
  "arguments": {}
}
```

### Get Real-time Quote
```javascript
{
  "tool": "get_quote",
  "arguments": {
    "exchange": "NSE",
    "tradingsymbol": "INFY"
  }
}
```

## Development

### Running Locally
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Important Notes

1. **Market Hours**: Indian markets operate 9:15 AM - 3:30 PM IST on weekdays
2. **Product Types**:
   - `CNC`: Cash and Carry (delivery)
   - `MIS`: Margin Intraday Square-off
   - `NRML`: Normal (for F&O)
3. **Order Types**:
   - `MARKET`: Market order
   - `LIMIT`: Limit order
   - `SL`: Stop-loss limit
   - `SL-M`: Stop-loss market
4. **Rate Limits**: Be mindful of API rate limits
5. **Security**: Never expose API secrets in logs or responses

## Docker Build

To build the Docker image locally:

```bash
docker build -t zerodha-kite-mcp .
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- [Kite Connect Documentation](https://kite.trade/docs/connect/v3/)
- [API Playground](https://kite.trade/docs/connect/v3/api/)
- [Developer Forum](https://kite.trade/forum/)
- [GitHub Issues](https://github.com/anshuljain90/zerodha-kite-mcp/issues)

## Compliance

This MCP server is for legitimate trading purposes only. Users must comply with SEBI regulations and Zerodha's terms of service. Automated trading may require additional approvals from the exchange.

## Disclaimer

This is an unofficial integration. Use at your own risk. The authors are not responsible for any financial losses incurred through the use of this software.