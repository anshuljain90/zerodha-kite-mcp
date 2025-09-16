declare module 'kiteconnect' {
  export interface KiteConnectOptions {
    api_key: string;
    access_token?: string;
    root?: string;
    debug?: boolean;
    timeout?: number;
  }

  export interface OrderParams {
    exchange: string;
    tradingsymbol: string;
    transaction_type: 'BUY' | 'SELL';
    quantity: number;
    order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
    product: 'CNC' | 'MIS' | 'NRML';
    price?: number;
    trigger_price?: number;
    validity?: string;
    tag?: string;
  }

  export interface Order {
    order_id: string;
    status: string;
    tradingsymbol: string;
    exchange: string;
    quantity: number;
    price: number;
    transaction_type: string;
    product: string;
  }

  export interface Position {
    tradingsymbol: string;
    exchange: string;
    quantity: number;
    average_price: number;
    last_price: number;
    pnl: number;
  }

  export interface Holding {
    tradingsymbol: string;
    quantity: number;
    average_price: number;
    last_price: number;
    pnl: number;
  }

  export interface Margin {
    enabled: boolean;
    net: number;
    available: {
      cash: number;
      intraday_payin: number;
      opening_balance: number;
    };
  }

  export interface Quote {
    last_price: number;
    volume: number;
    buy_quantity: number;
    sell_quantity: number;
    ohlc: {
      open: number;
      high: number;
      low: number;
      close: number;
    };
  }

  export interface HistoricalData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export interface Instrument {
    instrument_token: number;
    exchange_token: number;
    tradingsymbol: string;
    name: string;
    exchange: string;
    segment: string;
    instrument_type: string;
    lot_size: number;
  }

  export interface Trade {
    trade_id: string;
    order_id: string;
    exchange: string;
    tradingsymbol: string;
    transaction_type: string;
    quantity: number;
    price: number;
  }

  export interface Profile {
    user_id: string;
    user_name: string;
    user_shortname: string;
    email: string;
    user_type: string;
    broker: string;
  }

  export class KiteConnect {
    constructor(options: KiteConnectOptions);
    setSessionExpiryHook(fn: () => void): void;
    setAccessToken(token: string): void;
    generateSession(request_token: string, api_secret: string): Promise<any>;
    getLoginURL(): string;

    placeOrder(variety: string, params: OrderParams): Promise<Order>;
    modifyOrder(variety: string, order_id: string, params: Partial<OrderParams>): Promise<Order>;
    cancelOrder(variety: string, order_id: string): Promise<Order>;

    getOrders(): Promise<Order[]>;
    getOrderHistory(order_id: string): Promise<Order[]>;
    getTrades(): Promise<Trade[]>;

    getPositions(): Promise<{ net: Position[]; day: Position[] }>;
    getHoldings(): Promise<Holding[]>;
    getMargins(segment?: string): Promise<Margin>;

    getQuote(instruments: string[]): Promise<Record<string, Quote>>;
    getHistoricalData(
      instrument_token: string,
      interval: string,
      from_date: Date,
      to_date: Date,
      continuous?: boolean,
      oi?: boolean
    ): Promise<HistoricalData[]>;
    getInstruments(exchange?: string[]): Promise<Instrument[]>;
    getLTP(instruments: string[]): Promise<Record<string, { last_price: number }>>;

    getProfile(): Promise<Profile>;
  }
}