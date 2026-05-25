import { onRequestPost as __api_register_js_onRequestPost } from "D:\\GitHub\\umroh-barokah-abadi\\functions\\api\\register.js"
import { onRequest as __api_check_status_js_onRequest } from "D:\\GitHub\\umroh-barokah-abadi\\functions\\api\\check-status.js"
import { onRequest as ___middleware_js_onRequest } from "D:\\GitHub\\umroh-barokah-abadi\\functions\\_middleware.js"

export const routes = [
    {
      routePath: "/api/register",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_register_js_onRequestPost],
    },
  {
      routePath: "/api/check-status",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_check_status_js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]