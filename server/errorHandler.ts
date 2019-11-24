import { Context, Next } from 'koa';

const errorHandler = () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        result: 'error',
        message: err.expose ? err.message : 'Internal Server Error'
      };
    }
  };
};

export default errorHandler;
