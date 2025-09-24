# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-24

### Added
- Initial release of Zerodha Kite Connect MCP Server
- Trading operations support:
  - Place buy/sell orders
  - Modify pending orders
  - Cancel pending orders
- Portfolio management features:
  - View open positions
  - View demat holdings
  - Check available margins
- Market data capabilities:
  - Get real-time quotes
  - Get historical OHLC data
  - List tradeable instruments
  - Get last traded prices
- Order management tools:
  - View all orders
  - View executed trades
  - Get order modification history
- Account features:
  - Get user profile
  - Check market status
- Authentication flow with OAuth 2.0
- Docker support for easy deployment
- TypeScript implementation for type safety
- Comprehensive logging with Winston
- Support for NSE and BSE exchanges
- Environment variable configuration
- Health check endpoint for monitoring

### Security
- API secret protection in environment variables
- Non-root user in Docker container
- Secure OAuth 2.0 authentication flow

### Documentation
- Comprehensive README with usage examples
- API tool descriptions and parameters
- Installation and configuration guides
- Compliance and disclaimer notices

[0.1.0]: https://github.com/anshuljain90/zerodha-kite-mcp/releases/tag/v0.1.0