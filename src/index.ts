#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { KiteConnect } from 'kiteconnect';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

class ZerodhaKiteMCPServer {
  private server: Server;
  private kite: KiteConnect | null = null;
  private apiKey: string;
  private accessToken: string | null = null;

  constructor() {
    this.apiKey = process.env.KITE_API_KEY || '';
    // API Secret would be used for session generation in production
    // const apiSecret = process.env.KITE_API_SECRET || '';
    this.accessToken = process.env.KITE_ACCESS_TOKEN || null;

    this.server = new Server(
      {
        name: 'zerodha-kite-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.initializeKiteConnect();
  }

  private initializeKiteConnect() {
    if (!this.apiKey) {
      logger.error('KITE_API_KEY is required');
      return;
    }

    this.kite = new KiteConnect({
      api_key: this.apiKey,
    });

    if (this.accessToken) {
      this.kite.setAccessToken(this.accessToken);
      logger.info('Kite Connect initialized with access token');
    } else {
      logger.warn('No access token provided. Some operations may require authentication.');
    }
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!this.kite) {
        throw new Error('Kite Connect not initialized. Check API credentials.');
      }

      try {
        switch (name) {
          case 'place_order':
            return await this.placeOrder(args);
          case 'modify_order':
            return await this.modifyOrder(args);
          case 'cancel_order':
            return await this.cancelOrder(args);
          case 'get_positions':
            return await this.getPositions();
          case 'get_holdings':
            return await this.getHoldings();
          case 'get_margins':
            return await this.getMargins();
          case 'get_quote':
            return await this.getQuote(args);
          case 'get_historical_data':
            return await this.getHistoricalData(args);
          case 'get_instruments':
            return await this.getInstruments(args);
          case 'get_orders':
            return await this.getOrders();
          case 'get_trades':
            return await this.getTrades();
          case 'get_order_history':
            return await this.getOrderHistory(args);
          case 'get_profile':
            return await this.getProfile();
          case 'get_ltp':
            return await this.getLTP(args);
          case 'get_market_status':
            return await this.getMarketStatus();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message || 'Unknown error occurred'}`,
            },
          ],
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'place_order',
        description: 'Place a new order in the market',
        inputSchema: {
          type: 'object',
          properties: {
            exchange: { type: 'string', description: 'Trading exchange (NSE, BSE, NFO, CDS, MCX)' },
            tradingsymbol: { type: 'string', description: 'Trading symbol' },
            transaction_type: { type: 'string', enum: ['BUY', 'SELL'] },
            quantity: { type: 'number', description: 'Number of shares/lots' },
            order_type: { type: 'string', enum: ['MARKET', 'LIMIT', 'SL', 'SL-M'] },
            product: { type: 'string', enum: ['CNC', 'MIS', 'NRML'] },
            price: { type: 'number', description: 'Price for LIMIT orders' },
            trigger_price: { type: 'number', description: 'Trigger price for SL orders' },
          },
          required: ['exchange', 'tradingsymbol', 'transaction_type', 'quantity', 'order_type', 'product'],
        },
      },
      {
        name: 'modify_order',
        description: 'Modify an existing pending order',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: { type: 'string' },
            quantity: { type: 'number' },
            price: { type: 'number' },
            order_type: { type: 'string' },
            trigger_price: { type: 'number' },
          },
          required: ['order_id'],
        },
      },
      {
        name: 'cancel_order',
        description: 'Cancel a pending order',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: { type: 'string' },
          },
          required: ['order_id'],
        },
      },
      {
        name: 'get_positions',
        description: 'Get all open positions',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_holdings',
        description: 'Get long-term holdings',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_margins',
        description: 'Get account margins and funds',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_quote',
        description: 'Get real-time market quotes',
        inputSchema: {
          type: 'object',
          properties: {
            exchange: { type: 'string' },
            tradingsymbol: { type: 'string' },
          },
          required: ['exchange', 'tradingsymbol'],
        },
      },
      {
        name: 'get_historical_data',
        description: 'Get historical candlestick data',
        inputSchema: {
          type: 'object',
          properties: {
            instrument_token: { type: 'string' },
            from_date: { type: 'string' },
            to_date: { type: 'string' },
            interval: { type: 'string' },
          },
          required: ['instrument_token', 'from_date', 'to_date', 'interval'],
        },
      },
      {
        name: 'get_instruments',
        description: 'Get list of tradeable instruments',
        inputSchema: {
          type: 'object',
          properties: {
            exchange: { type: 'string' },
          },
        },
      },
      {
        name: 'get_orders',
        description: 'Get all orders for the day',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_trades',
        description: 'Get all executed trades',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_order_history',
        description: 'Get order history',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: { type: 'string' },
          },
          required: ['order_id'],
        },
      },
      {
        name: 'get_profile',
        description: 'Get user profile',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_ltp',
        description: 'Get last traded price',
        inputSchema: {
          type: 'object',
          properties: {
            instruments: { type: 'array', items: { type: 'string' } },
          },
          required: ['instruments'],
        },
      },
      {
        name: 'get_market_status',
        description: 'Check market status',
        inputSchema: { type: 'object', properties: {} },
      },
    ];
  }

  private async placeOrder(args: any) {
    const orderParams = {
      exchange: args.exchange,
      tradingsymbol: args.tradingsymbol,
      transaction_type: args.transaction_type,
      quantity: args.quantity,
      order_type: args.order_type,
      product: args.product,
      price: args.price || 0,
      trigger_price: args.trigger_price || 0,
    };

    const response = await this.kite!.placeOrder('regular', orderParams);
    return {
      content: [
        {
          type: 'text',
          text: `Order placed successfully. Order ID: ${response.order_id}`,
        },
      ],
    };
  }

  private async modifyOrder(args: any) {
    const response = await this.kite!.modifyOrder(
      'regular',
      args.order_id,
      {
        quantity: args.quantity,
        price: args.price,
        order_type: args.order_type,
        trigger_price: args.trigger_price,
      }
    );
    return {
      content: [
        {
          type: 'text',
          text: `Order modified successfully. Order ID: ${response.order_id}`,
        },
      ],
    };
  }

  private async cancelOrder(args: any) {
    const response = await this.kite!.cancelOrder('regular', args.order_id);
    return {
      content: [
        {
          type: 'text',
          text: `Order cancelled successfully. Order ID: ${response.order_id}`,
        },
      ],
    };
  }

  private async getPositions() {
    const positions = await this.kite!.getPositions();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(positions, null, 2),
        },
      ],
    };
  }

  private async getHoldings() {
    const holdings = await this.kite!.getHoldings();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(holdings, null, 2),
        },
      ],
    };
  }

  private async getMargins() {
    const margins = await this.kite!.getMargins();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(margins, null, 2),
        },
      ],
    };
  }

  private async getQuote(args: any) {
    const instruments = [`${args.exchange}:${args.tradingsymbol}`];
    const quotes = await this.kite!.getQuote(instruments);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(quotes, null, 2),
        },
      ],
    };
  }

  private async getHistoricalData(args: any) {
    const historicalData = await this.kite!.getHistoricalData(
      args.instrument_token,
      args.interval,
      new Date(args.from_date),
      new Date(args.to_date)
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(historicalData, null, 2),
        },
      ],
    };
  }

  private async getInstruments(args: any) {
    const instruments = await this.kite!.getInstruments(args.exchange);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(instruments.slice(0, 100), null, 2), // Limit to first 100
        },
      ],
    };
  }

  private async getOrders() {
    const orders = await this.kite!.getOrders();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(orders, null, 2),
        },
      ],
    };
  }

  private async getTrades() {
    const trades = await this.kite!.getTrades();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(trades, null, 2),
        },
      ],
    };
  }

  private async getOrderHistory(args: any) {
    const history = await this.kite!.getOrderHistory(args.order_id);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(history, null, 2),
        },
      ],
    };
  }

  private async getProfile() {
    const profile = await this.kite!.getProfile();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(profile, null, 2),
        },
      ],
    };
  }

  private async getLTP(args: any) {
    const ltp = await this.kite!.getLTP(args.instruments);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(ltp, null, 2),
        },
      ],
    };
  }

  private async getMarketStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 100 + minutes;

    let status = 'CLOSED';
    let message = '';

    if (day >= 1 && day <= 5) { // Monday to Friday
      if (time >= 915 && time < 1530) {
        status = 'OPEN';
        message = 'Indian markets are open';
      } else if (time < 915) {
        status = 'PRE_OPEN';
        message = 'Pre-market session';
      } else {
        message = 'Markets closed for the day';
      }
    } else {
      message = 'Markets closed (weekend)';
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status, message, timestamp: now.toISOString() }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Zerodha Kite MCP Server running on stdio');
  }
}

const server = new ZerodhaKiteMCPServer();
server.run().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});