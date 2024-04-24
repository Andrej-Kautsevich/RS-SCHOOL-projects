var ee = Object.defineProperty;
var te = (s, e, t) =>
  e in s
    ? ee(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (s[e] = t);
var a = (s, e, t) => (te(s, typeof e != "symbol" ? e + "" : e, t), t);
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) o(r);
  new MutationObserver((r) => {
    for (const n of r)
      if (n.type === "childList")
        for (const l of n.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && o(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(r) {
    const n = {};
    return (
      r.integrity && (n.integrity = r.integrity),
      r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (n.credentials = "omit")
        : (n.credentials = "same-origin"),
      n
    );
  }
  function o(r) {
    if (r.ep) return;
    r.ep = !0;
    const n = t(r);
    fetch(r.href, n);
  }
})();
const C = class C {
  constructor() {
    a(this, "listeners", {});
  }
  static getInstance() {
    return C.observer;
  }
  subscribe(e, t) {
    this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t);
  }
  unsubscribe(e, t) {
    this.listeners[e] &&
      (this.listeners[e] = this.listeners[e].filter((o) => o !== t));
  }
  notify(e, t) {
    this.listeners[e] && this.listeners[e].forEach((o) => o(t));
  }
};
a(C, "observer", new C());
let S = C;
var i = ((s) => (
  (s.socketOpen = "socketOpen"),
  (s.socketClose = "socketClose"),
  (s.loginResponse = "loginResponse"),
  (s.externalLoginResponse = "externalLoginResponse"),
  (s.logoutResponse = "logoutResponse"),
  (s.externalLogoutResponse = "externalLogoutResponse"),
  (s.allActiveUsers = "allActiveUsers"),
  (s.allInactiveUsers = "allInactiveUsers"),
  (s.messageHistory = "messageHistory"),
  (s.messageSend = "messageSend"),
  (s.messageRead = "messageRead"),
  (s.openDialog = "openDialog"),
  s
))(i || {});
class se {
  constructor() {
    a(this, "routes", []);
    window.addEventListener("popstate", () => this.loadInitialRoute());
  }
  matchUrlToRoute(e) {
    return this.routes.find((o) => o.path === e);
  }
  loadInitialRoute() {
    const t = window.location.pathname.split("/").slice(1).join("/");
    this.loadRoute(t);
  }
  setRoutes(e) {
    this.routes = e;
  }
  loadRoute(e) {
    const t = this.matchUrlToRoute(e);
    if (!t) throw new Error("Route not found");
    t.callback();
  }
  navigateTo(e) {
    window.history.pushState({}, "", e), this.loadRoute(e);
  }
}
const k = class k {
  constructor(e) {
    a(this, "storageKeyPrefix");
    this.storageKeyPrefix = e;
  }
  static getInstance() {
    return k.sessionStorageService;
  }
  getStorageKey(e) {
    return `${this.storageKeyPrefix}_${e}`;
  }
  saveData(e, t) {
    const o = this.getStorageKey(e.toString());
    sessionStorage.setItem(o, JSON.stringify(t));
  }
  removeData(e) {
    const t = this.getStorageKey(e.toString());
    sessionStorage.removeItem(t);
  }
  getData(e) {
    const t = this.getStorageKey(e.toString()),
      o = sessionStorage.getItem(t);
    if (!o) return null;
    try {
      return JSON.parse(o);
    } catch (r) {
      throw new Error(`Error parsing data: ${r}`);
    }
  }
};
a(k, "sessionStorageService", new k("fun-chat"));
let E = k;
const oe = "ws://127.0.0.1:4000";
var c = ((s) => (
    (s.LOGIN = "USER_LOGIN"),
    (s.LOGOUT = "USER_LOGOUT"),
    (s.LOGIN_EXTERNAL = "USER_EXTERNAL_LOGIN"),
    (s.LOGOUT_EXTERNAL = "USER_EXTERNAL_LOGOUT"),
    (s.ALL_ACTIVE = "USER_ACTIVE"),
    (s.ALL_INACTIVE = "USER_INACTIVE"),
    (s.MESSAGE_HISTORY = "MSG_FROM_USER"),
    (s.MESSAGE_SEND = "MSG_SEND"),
    (s.MESSAGE_READ = "MSG_READ"),
    (s.SELECT_USER = "SELECT_USER"),
    s
  ))(c || {}),
  D = ((s) => ((s.ERROR = "ERROR"), s))(D || {});
const x = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15),
  Y = (s) => ({
    id: x(),
    type: c.LOGIN,
    payload: { user: { login: s.login, password: s.password } },
  }),
  ae = (s, e) => ({ id: s, type: c.LOGOUT, payload: { user: e } }),
  re = () => ({ id: x(), type: c.ALL_ACTIVE, payload: null }),
  ne = () => ({ id: x(), type: c.ALL_INACTIVE, payload: null }),
  ie = (s) => ({
    id: x(),
    type: c.MESSAGE_HISTORY,
    payload: { user: { login: s.login } },
  }),
  J = (s) => ({ id: x(), type: c.MESSAGE_READ, payload: { message: s } }),
  ce = (s) => ({ id: x(), type: c.MESSAGE_SEND, payload: { message: s } }),
  M = class M {
    constructor() {
      a(this, "observer", S.getInstance());
      a(this, "connection", null);
      this.connection === null && this.connectSocket();
    }
    static getInstance() {
      return M.instance || (M.instance = new M()), M.instance;
    }
    sendMessage(e) {
      return this.connection !== null && this.connection.OPEN
        ? (this.connection.send(JSON.stringify(e)), !0)
        : !1;
    }
    connectSocket() {
      let e;
      const t = () => {
        e = setTimeout(() => this.connectSocket(), 1e3);
      };
      (this.connection = new WebSocket(oe)),
        (this.connection.onopen = () => {
          this.observer.notify(i.socketOpen, ""),
            clearTimeout(e),
            this.setListeners();
        }),
        (this.connection.onclose = () => {
          this.observer.notify(i.socketClose, ""), t();
        });
    }
    getConnection() {
      return this.connection;
    }
    setListeners() {
      var e;
      (e = this.connection) == null ||
        e.addEventListener("message", (t) => {
          const o = JSON.parse(t.data);
          this.handleServerResponse(o);
        });
    }
    handleServerResponse(e) {
      if ("type" in e && "payload" in e) this.handleAuthentication(e);
      else throw new Error(`Unknown server response: ${e}`);
    }
    handleAuthentication(e) {
      switch (e.type) {
        case D.ERROR: {
          this.observer.notify(i.loginResponse, e),
            this.observer.notify(i.logoutResponse, e);
          break;
        }
        case c.LOGIN: {
          this.observer.notify(i.loginResponse, e);
          break;
        }
        case c.LOGOUT: {
          this.observer.notify(i.logoutResponse, e);
          break;
        }
        default:
          this.handleExternalAuthentication(e);
      }
    }
    handleExternalAuthentication(e) {
      switch (e.type) {
        case c.LOGIN_EXTERNAL: {
          this.observer.notify(i.externalLoginResponse, e);
          break;
        }
        case c.LOGOUT_EXTERNAL: {
          this.observer.notify(i.externalLogoutResponse, e);
          break;
        }
        default:
          this.handleGetUsers(e);
      }
    }
    handleGetUsers(e) {
      switch (e.type) {
        case c.ALL_ACTIVE: {
          this.observer.notify(i.allActiveUsers, e);
          break;
        }
        case c.ALL_INACTIVE: {
          this.observer.notify(i.allInactiveUsers, e);
          break;
        }
        default:
          this.handleMessages(e);
      }
    }
    handleMessages(e) {
      switch (e.type) {
        case c.MESSAGE_HISTORY: {
          this.observer.notify(i.messageHistory, e);
          break;
        }
        case c.MESSAGE_SEND: {
          this.observer.notify(i.messageSend, e);
          break;
        }
        case c.MESSAGE_READ: {
          this.observer.notify(i.messageRead, e);
          break;
        }
      }
    }
  };
a(M, "instance");
let I = M;
const le = (s) => typeof s < "u" && s !== null;
class h {
  constructor(e, ...t) {
    a(this, "node");
    a(this, "children", []);
    const o = document.createElement(e.tag ?? "div");
    Object.assign(o, e),
      e.txt && (o.textContent = e.txt),
      e.classNames && o.classList.add(...e.classNames),
      (this.node = o),
      this.appendChildren(t);
  }
  append(e) {
    e instanceof h
      ? (this.children.push(e), this.node.append(e.getNode()))
      : this.node.append(e);
  }
  appendChildren(e) {
    e.filter(le).forEach((t) => this.append(t));
  }
  getNode() {
    return this.node;
  }
  getChildren() {
    return this.children;
  }
  setTextContent(e) {
    this.node.textContent = e;
  }
  setAttribute(e, t) {
    this.node.setAttribute(e, t);
  }
  removeAttribute(e) {
    this.node.removeAttribute(e);
  }
  toggleClass(e, t) {
    this.node.classList.toggle(e, t);
  }
  addClasses(e) {
    this.node.classList.add(...e);
  }
  removeClasses(e) {
    this.node.classList.remove(...e);
  }
  addListener(e, t, o = !1) {
    this.node.addEventListener(e, t, o);
  }
  removeListener(e, t, o = !1) {
    this.node.removeEventListener(e, t, o);
  }
  destroyChildren() {
    this.children.forEach((e) => e.destroy()), (this.children.length = 0);
  }
  destroy() {
    this.destroyChildren(), this.node.remove();
  }
}
const g = (s, ...e) => new h({ ...s }, ...e),
  V = (s, ...e) => new h({ ...s, tag: "p" }, ...e),
  v = (s) => new h({ ...s, tag: "span" }),
  W = (s, ...e) => new h({ ...s, tag: "a" }, ...e),
  ge = (s, ...e) => new h({ ...s, tag: "main" }, ...e),
  de = (s, ...e) => new h({ ...s, tag: "header" }, ...e),
  ue = (s, ...e) => new h({ ...s, tag: "footer" }, ...e),
  Z = (s, ...e) => new h({ ...s, tag: "form" }, ...e),
  $ = (s, ...e) => new h({ ...s, tag: "label" }, ...e),
  q = (s) => new h({ ...s, tag: "input" }),
  _e = (s) => new h({ ...s, tag: "textarea" }),
  U = (s, ...e) => new h({ ...s, tag: "button" }, ...e),
  he = (s, e, ...t) => new h({ ...e, tag: `h${s}` }, ...t),
  me = (s, ...e) => new h({ ...s, tag: "ul" }, ...e),
  pe = (s, ...e) => new h({ ...s, tag: "li" }, ...e),
  fe = "_aboutPage_13n66_1",
  ve = "_content_13n66_13",
  H = { aboutPage: fe, content: ve },
  be = "_button_1mqda_1",
  A = { button: be };
class we {
  constructor() {
    a(this, "page");
    a(this, "backButton");
    (this.page = g({ className: H.aboutPage })),
      (this.backButton = U({ classNames: [H.button, A.button], txt: "Back" }));
    const e = g(
      { className: H.content },
      v({ textContent: "This is educational project" }),
      this.backButton
    );
    this.page.append(e);
  }
  getPage() {
    return this.page.getNode();
  }
  getBackButton() {
    return this.backButton;
  }
}
class ye {
  constructor() {
    a(this, "view");
    (this.view = new we()), this.setBackButtonHandler();
  }
  openPage(e) {
    e.append(this.getPage());
  }
  getPage() {
    return this.view.getPage();
  }
  setBackButtonHandler() {
    this.view.getBackButton().addListener("click", () => {
      window.history.back();
    });
  }
}
const Le = "_overlay_lgwmk_1",
  Se = "_modal_lgwmk_10",
  F = { overlay: Le, modal: Se };
class Ne {
  constructor() {
    a(this, "modal");
    a(this, "overlay");
    (this.modal = g({ className: F.modal })),
      (this.overlay = this.createOverlay());
  }
  getOverlay() {
    return (this.overlay = this.createOverlay()), this.overlay;
  }
  removeOverlay() {
    var e;
    (e = this.overlay) == null || e.destroy();
  }
  createOverlay() {
    const e = v({
      className: F.modal__content,
      txt: "Connection to server...",
    });
    return this.modal.append(e), g({ classNames: [F.overlay] }, this.modal);
  }
}
class Me {
  constructor(e) {
    a(this, "root");
    a(this, "view", new Ne());
    this.root = e;
  }
  showWaiter() {
    this.view.removeOverlay(),
      this.root.append(this.view.getOverlay().getNode());
  }
  hideWaiter() {
    this.view.removeOverlay();
  }
}
const Ee = {
  currentAuthorizedUsers: [],
  currentUnauthorizedUsers: [],
  currentUser: null,
  selectedUser: null,
  allUsers: [],
  currentUserDialogs: [],
  openedDialog: null,
};
var G = ((s) => ((s.OPEN_DIALOG = "OPEN_DIALOG"), s))(G || {});
const Ie = (s) => ({ type: c.ALL_ACTIVE, payload: s }),
  xe = (s) => ({ type: c.ALL_INACTIVE, payload: s }),
  j = (s) => ({ type: c.MESSAGE_HISTORY, payload: s }),
  Re = (s) => ({ type: G.OPEN_DIALOG, payload: s }),
  Ue = (s) => ({ type: c.LOGIN, payload: s }),
  Ae = (s) => ({ type: c.SELECT_USER, payload: s }),
  Te = (s, e) => {
    switch (e.type) {
      case c.ALL_ACTIVE:
        return { ...s, currentAuthorizedUsers: e.payload };
      case c.ALL_INACTIVE:
        return { ...s, currentUnauthorizedUsers: e.payload };
      case c.MESSAGE_HISTORY:
        return { ...s };
      case c.LOGIN:
        return { ...s, currentUser: e.payload };
      case c.SELECT_USER:
        return { ...s, selectedUser: e.payload };
      case G.OPEN_DIALOG:
        return { ...s, openedDialog: e.payload };
      default:
        return s;
    }
  };
class Ce {
  constructor() {
    a(this, "state", Ee);
    a(this, "reducer", Te);
  }
  dispatch(e) {
    this.state = this.reducer(this.state, e);
  }
  getState() {
    return this.state;
  }
}
const u = new Ce(),
  L = (s) =>
    ((t) =>
      typeof t == "object" &&
      t !== null &&
      "type" in t &&
      "id" in t &&
      "payload" in t)(s)
      ? s
      : null;
var f = ((s) => (
  (s.DEFAULT = "/"),
  (s.LOGIN = "/login"),
  (s.MAIN = "/main"),
  (s.ABOUT = "/about"),
  s
))(f || {});
const ke = "_login__form_oxj5r_1",
  Be = "_login__form_oxj5r_1",
  Pe = "_form_oxj5r_8",
  De = "_form__field_oxj5r_8",
  Oe = "_form__field_oxj5r_8",
  He = "_form__label_oxj5r_13",
  Fe = "_form__label_oxj5r_13",
  Ge = "_form__input_oxj5r_16",
  Ve = "_form__input_oxj5r_16",
  We = "_form__requirements_oxj5r_25",
  $e = "_form__requirements_oxj5r_25",
  qe = "_form__button_oxj5r_30",
  je = "_form__button_oxj5r_30",
  b = {
    login__form: ke,
    loginForm: Be,
    form: Pe,
    form__field: De,
    formField: Oe,
    form__label: He,
    formLabel: Fe,
    form__input: Ge,
    formInput: Ve,
    form__requirements: We,
    formRequirements: $e,
    form__button: qe,
    formButton: je,
  };
class Ke {
  constructor() {
    a(this, "form");
    a(this, "loginInput");
    a(this, "passwordInput");
    a(this, "submitButton");
    (this.loginInput = q({
      className: b.form__input,
      type: "text",
      name: "login",
      id: "login",
      required: !0,
      pattern: "^[A-Za-z\\-]{3,}$",
      placeholder: "login",
      autocomplete: "off",
    })),
      (this.passwordInput = q({
        className: b.form__input,
        type: "password",
        name: "password",
        id: "password",
        required: !0,
        pattern: "^(?=.*[A-Z])(?=.*\\d).{4,}$",
        placeholder: "password",
      })),
      (this.submitButton = U({
        classNames: [b.form__button, A.button],
        txt: "Enter",
        type: "submit",
        disabled: !0,
      })),
      (this.form = Z(
        { classNames: [b.login__form, b.form] },
        g(
          { className: b.form__field },
          $({ className: b.formLabel, txt: "Enter login", htmlFor: "login" }),
          this.loginInput,
          V({
            className: b.form__requirements,
            txt: "The user's login must consist only of letters of the English alphabet and a hyphen ('-') and contain at least 3 letters",
          })
        ),
        g(
          { className: b.form__field },
          $({
            className: b.form__label,
            txt: "Enter password:",
            htmlFor: "password",
          }),
          this.passwordInput,
          V({
            className: b.form__requirements,
            txt: "The user's password must have at least 1 upper case letter, at least 1 number and contain at least 4 symbols",
          })
        ),
        this.submitButton
      ));
  }
  getForm() {
    return this.form.getNode();
  }
  clearForm() {
    (this.loginInput.getNode().value = ""),
      (this.passwordInput.getNode().value = ""),
      (this.submitButton.getNode().disabled = !0);
  }
}
class ze {
  constructor() {
    a(this, "view");
    a(this, "socket", I.getInstance());
    a(this, "sessionStorageService", E.getInstance());
    a(this, "user", null);
    (this.view = new Ke()), this.setupForm();
  }
  getForm() {
    return this.view.getForm();
  }
  setupForm() {
    this.view.loginInput.addListener("input", () => this.validateForm()),
      this.view.passwordInput.addListener("input", () => this.validateForm()),
      this.view.form.addListener("submit", (e) => this.handleSubmit(e));
  }
  validateForm() {
    this.view.loginInput.getNode().validity.valid &&
    this.view.passwordInput.getNode().validity.valid
      ? this.view.submitButton.removeAttribute("disabled")
      : this.view.submitButton.setAttribute("disabled", "true");
  }
  handleSubmit(e) {
    e.preventDefault();
    const t = this.view.loginInput.getNode().value,
      o = this.view.passwordInput.getNode().value;
    (this.user = { login: t, password: o }),
      this.socket.sendMessage(Y(this.user)),
      this.sessionStorageService.saveData("user", this.user),
      this.view.clearForm();
  }
}
const K = {
    keyFrames: [
      { transform: "translateX(110%)" },
      { transform: "translateX(-10%)", offset: 0.5 },
      { transform: "translateX(-10%)", offset: 0.8 },
      { transform: "translateX(110%)" },
    ],
    duration: 3e3,
  },
  Xe = "_login-page_1xb62_1",
  Ye = "_error_1xb62_5",
  B = { "login-page": "_login-page_1xb62_1", loginPage: Xe, error: Ye };
class Je {
  constructor(e) {
    a(this, "page");
    a(this, "errorWrapper");
    a(this, "errorMessage");
    a(this, "aboutPageButton");
    (this.page = g({ classNames: [B.loginPage] })),
      (this.errorMessage = v({ className: B.error__text })),
      (this.errorWrapper = g({ className: B.error }, this.errorMessage)),
      (this.aboutPageButton = this.createAboutPageButton()),
      this.page.appendChildren([
        e.getForm(),
        this.aboutPageButton,
        this.errorWrapper,
      ]);
  }
  getPage() {
    return this.page.getNode();
  }
  createAboutPageButton() {
    return (
      (this.aboutPageButton = U({
        classNames: [A.button, B.button],
        txt: "About",
      })),
      this.aboutPageButton
    );
  }
  showError(e) {
    this.errorMessage.setTextContent(e),
      this.errorWrapper
        .getNode()
        .animate(K.keyFrames, { duration: K.duration });
  }
}
class Ze {
  constructor(e) {
    a(this, "view");
    a(this, "loginForm");
    a(this, "router");
    a(this, "observer", S.getInstance());
    a(this, "sessionStorageService", E.getInstance());
    (this.router = e),
      (this.loginForm = new ze()),
      (this.view = new Je(this.loginForm)),
      this.setUserLoginHandler(),
      this.setButtonsHandler();
  }
  openPage(e) {
    this.sessionStorageService.getData("user")
      ? this.router.navigateTo(f.MAIN)
      : e.append(this.getPage());
  }
  getPage() {
    return this.view.getPage();
  }
  setButtonsHandler() {
    this.view.aboutPageButton.addListener("click", () =>
      this.aboutPageButtonHandler()
    );
  }
  aboutPageButtonHandler() {
    this.router.navigateTo(f.ABOUT);
  }
  setUserLoginHandler() {
    this.observer.subscribe(i.loginResponse, (e) => {
      var o, r;
      const t = L(e);
      if (t) {
        if (t.type === D.ERROR) {
          this.showErrorMessage(
            ((o = t.payload) == null ? void 0 : o.error) ??
              "Server error, please try later"
          );
          return;
        }
        (r = t.payload) != null &&
          r.user &&
          this.handleSuccessLogin(t.payload.user);
      }
    });
  }
  showErrorMessage(e) {
    this.view.showError(e);
  }
  handleSuccessLogin(e) {
    this.router.navigateTo(f.MAIN), u.dispatch(Ue(e));
  }
}
const Qe = (s, e) => {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      o = document.createElementNS("http://www.w3.org/2000/svg", "use");
    return (
      o.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${s}`),
      t.append(o),
      e && t.classList.add(...e),
      t
    );
  },
  et = "_footer_l0bl8_1",
  tt = "_footer__link_l0bl8_12",
  st = "_footer__link_l0bl8_12",
  P = { footer: et, footer__link: tt, footerLink: st };
class ot {
  constructor() {
    a(this, "footer");
    this.footer = ue({ className: P.footer });
    const e = Qe("rs_school_logo"),
      t = W(
        {
          className: P.footer__link,
          href: "https://rs.school/",
          target: "blank",
        },
        e
      ),
      o = W(
        {
          className: P.footer__link,
          href: "https://github.com/Andrej-Kautsevich",
          target: "blank",
        },
        v({ txt: "My Github" })
      ),
      r = v({ className: P.footer__date, textContent: "2024" });
    this.footer.appendChildren([o, t, r]);
  }
  getFooter() {
    return this.footer;
  }
}
class at {
  constructor() {
    a(this, "view");
    this.view = new ot();
  }
  getFooter() {
    return this.view.getFooter();
  }
}
const rt = "_header_qofb0_1",
  nt = "_header__content_qofb0_11",
  it = "_header__content_qofb0_11",
  ct = "_header__user_qofb0_15",
  lt = "_header__user_qofb0_15",
  gt = "_header__heading_qofb0_18",
  dt = "_header__heading_qofb0_18",
  ut = "_header__buttons_qofb0_21",
  _t = "_header__buttons_qofb0_21",
  N = {
    header: rt,
    header__content: nt,
    headerContent: it,
    header__user: ct,
    headerUser: lt,
    header__heading: gt,
    headerHeading: dt,
    header__buttons: ut,
    headerButtons: _t,
  };
class ht {
  constructor() {
    a(this, "header");
    a(this, "userLogin");
    a(this, "logoutButton");
    a(this, "aboutPageButton");
    this.userLogin = v({ className: N.header__user });
    const e = he(1, { className: N.header__heading, txt: "Fun Chat" }),
      t = g({ className: N.header__content }, e, this.userLogin);
    (this.logoutButton = this.createLogoutButton()),
      (this.aboutPageButton = this.createAboutPageButton());
    const o = g(
      { className: N.header__buttons },
      this.logoutButton,
      this.aboutPageButton
    );
    this.header = de({ className: N.header }, t, o);
  }
  getHeader() {
    return this.header;
  }
  setUser(e) {
    this.userLogin.setTextContent(`Hello, ${e}!`);
  }
  createLogoutButton() {
    return (
      (this.logoutButton = U({
        classNames: [A.button, N.button],
        txt: "Logout",
      })),
      this.logoutButton
    );
  }
  createAboutPageButton() {
    return (
      (this.aboutPageButton = U({
        classNames: [A.button, N.button],
        txt: "About",
      })),
      this.aboutPageButton
    );
  }
}
class mt {
  constructor(e) {
    a(this, "router");
    a(this, "observer", S.getInstance());
    a(this, "socket", I.getInstance());
    a(this, "sessionStorageService", E.getInstance());
    a(this, "view");
    (this.router = e), (this.view = new ht()), this.init();
  }
  getHeader() {
    return this.view.getHeader();
  }
  setUser() {
    const e = this.sessionStorageService.getData("user");
    e && this.view.setUser(e.login);
  }
  init() {
    this.setUser(), this.setButtonsHandler(), this.subscribeToEvents();
  }
  setButtonsHandler() {
    this.view.logoutButton.addListener("click", () =>
      this.logoutButtonHandler()
    ),
      this.view.aboutPageButton.addListener("click", () =>
        this.aboutPageButtonHandler()
      );
  }
  logoutButtonHandler() {
    const e = this.sessionStorageService.getData("user");
    if (!e) return;
    const t = x();
    this.socket.sendMessage(ae(t, e));
  }
  aboutPageButtonHandler() {
    this.router.navigateTo(f.ABOUT);
  }
  logoutHandler(e) {
    var t, o, r;
    if (e.type === D.ERROR)
      throw new Error(
        `Server error: ${(t = e.payload) == null ? void 0 : t.error}`
      );
    ((r = (o = e.payload) == null ? void 0 : o.user) == null
      ? void 0
      : r.isLogined) === !1 &&
      (this.sessionStorageService.removeData("user"),
      this.router.navigateTo(f.LOGIN));
  }
  subscribeToEvents() {
    this.observer.subscribe(i.loginResponse, () => this.setUser()),
      this.observer.subscribe(i.logoutResponse, (e) => {
        const t = L(e);
        t && this.logoutHandler(t);
      });
  }
}
const pt = "_contacts_123bd_1",
  ft = "_contacts__users_123bd_10",
  vt = "_contacts__users_123bd_10",
  bt = "_contacts__user_123bd_10",
  wt = "_contacts__user_123bd_10",
  yt = "_contacts__user_active_123bd_48",
  Lt = "_contacts__user_active_123bd_48",
  St = "_contacts__user_inactive_123bd_51",
  Nt = "_contacts__user_inactive_123bd_51",
  Mt = "_contacts__count_123bd_54",
  Et = "_contacts__count_123bd_54",
  R = {
    contacts: pt,
    contacts__users: ft,
    contactsUsers: vt,
    contacts__user: bt,
    contactsUser: wt,
    contacts__user_active: yt,
    contactsUserActive: Lt,
    contacts__user_inactive: St,
    contactsUserInactive: Nt,
    contacts__count: Mt,
    contactsCount: Et,
  };
class It {
  constructor() {
    a(this, "contacts");
    a(this, "userList");
    (this.userList = me({ className: R.contacts__users })),
      (this.contacts = g({ className: R.contacts }, this.userList));
  }
  getContacts() {
    return this.contacts;
  }
  drawUser(e, t) {
    const o = pe({ className: R.contacts__user, txt: e.login }),
      r = e.isLogined ? R.contacts__user_active : R.contacts__user_inactive;
    if ((o.addClasses([r]), t)) {
      const n = v({ className: R.contacts__count, txt: `${t}` });
      o.append(n);
    }
    return this.userList.append(o), o;
  }
  clearList() {
    this.userList.destroyChildren();
  }
}
class xt {
  constructor() {
    a(this, "view");
    a(this, "observer", S.getInstance());
    a(this, "socket", I.getInstance());
    (this.view = new It()), this.subscribeToEvents();
  }
  getUserList() {
    return this.view.getContacts();
  }
  getUsers() {
    this.socket.sendMessage(re()), this.socket.sendMessage(ne());
  }
  handleMessages(e) {
    var o, r, n;
    const t = L(e);
    if (t) {
      const { currentUserDialogs: l, currentUser: d } = u.getState();
      let _ = [];
      if (
        ((o = t.payload) != null && o.message
          ? (_ = [t.payload.message])
          : (r = t.payload) != null && r.messages && (_ = t.payload.messages),
        _.length)
      ) {
        const { from: p, to: y } = _[0],
          O = p === (d == null ? void 0 : d.login) ? y : p,
          T = l.find((Q) => Q.login === O);
        T
          ? (T.messages =
              (n = t.payload) != null && n.message ? [...T.messages, ..._] : _)
          : l.push({ login: O, messages: _ });
      }
      u.dispatch(j(l));
    }
    this.drawUsers();
  }
  handleReadResponse(e) {
    var o, r;
    const t = L(e);
    if (t) {
      const { openedDialog: n } = u.getState(),
        l =
          n == null
            ? void 0
            : n.messages.find((d) => {
                var _, p;
                return (
                  d.id ===
                  ((p = (_ = t.payload) == null ? void 0 : _.message) == null
                    ? void 0
                    : p.id)
                );
              });
      l &&
        (r = (o = t.payload) == null ? void 0 : o.message) != null &&
        r.status &&
        (l.status.isReaded = t.payload.message.status.isReaded),
        this.drawUsers();
    }
  }
  handleSendResponse(e) {
    var o;
    const t = L(e);
    if (t) {
      const { openedDialog: r } = u.getState(),
        n = (o = t.payload) == null ? void 0 : o.message;
      n && (n == null ? void 0 : n.from) === (r == null ? void 0 : r.login)
        ? (r == null || r.messages.push(n),
          (n.status.isReaded = !0),
          this.socket.sendMessage(J(n)),
          this.drawUsers())
        : this.handleMessages(e);
    }
  }
  getAllUsersHandler(e) {
    var o;
    const t = L(e);
    if (t && (o = t.payload) != null && o.users) {
      const r = t.type === c.ALL_ACTIVE ? Ie : xe;
      u.dispatch(r(t.payload.users));
      const {
          currentAuthorizedUsers: n,
          currentUnauthorizedUsers: l,
          currentUser: d,
          currentUserDialogs: _,
        } = u.getState(),
        p = [...n, ...l].filter(
          (y) => y.login !== (d == null ? void 0 : d.login)
        );
      p.forEach((y) => {
        _.find((T) => T.login === y.login) ||
          _.push({ login: y.login, messages: [] });
      }),
        u.dispatch(j(_)),
        p.map((y) => this.getMessagesFromUser(y));
    }
  }
  getMessagesFromUser(e) {
    this.socket.sendMessage(ie(e));
  }
  drawUsers() {
    this.view.clearList();
    const {
        currentAuthorizedUsers: e,
        currentUnauthorizedUsers: t,
        currentUser: o,
        currentUserDialogs: r,
      } = u.getState(),
      n = [...e, ...t].filter(
        (d) => d.login !== (o == null ? void 0 : o.login)
      ),
      l = new Map();
    r.forEach((d) => {
      const _ = d.messages.filter(
        (p) => p.from !== (o == null ? void 0 : o.login) && !p.status.isReaded
      ).length;
      l.set(d.login, _);
    }),
      n.forEach((d) => {
        const _ = l.get(d.login);
        this.view
          .drawUser(d, _)
          .addListener("click", () => this.UserDialogHandler(d));
      });
  }
  UserDialogHandler(e) {
    u.dispatch(Ae(e)), this.observer.notify(i.openDialog, "");
  }
  subscribeToEvents() {
    this.observer.subscribe(i.allActiveUsers, (e) =>
      this.getAllUsersHandler(e)
    ),
      this.observer.subscribe(i.allInactiveUsers, (e) =>
        this.getAllUsersHandler(e)
      ),
      this.observer.subscribe(i.loginResponse, () => this.getUsers()),
      this.observer.subscribe(i.externalLoginResponse, () => this.getUsers()),
      this.observer.subscribe(i.externalLogoutResponse, () => this.getUsers()),
      this.observer.subscribe(i.messageHistory, (e) => this.handleMessages(e)),
      this.observer.subscribe(i.messageSend, (e) => this.handleSendResponse(e)),
      this.observer.subscribe(i.messageRead, (e) => this.handleReadResponse(e));
  }
}
const Rt = "_dialog_d55xt_1",
  Ut = "_dialog__user_d55xt_10",
  At = "_dialog__user_d55xt_10",
  Tt = "_dialog__user_active_d55xt_30",
  Ct = "_dialog__user_active_d55xt_30",
  kt = "_dialog__user_inactive_d55xt_33",
  Bt = "_dialog__user_inactive_d55xt_33",
  Pt = "_dialog__messages_d55xt_36",
  Dt = "_dialog__messages_d55xt_36",
  Ot = "_dialog__messages_empty_d55xt_45",
  Ht = "_dialog__messages_empty_d55xt_45",
  Ft = "_dialog__divider_d55xt_59",
  Gt = "_dialog__divider_d55xt_59",
  Vt = "_dialog__form_d55xt_80",
  Wt = "_dialog__form_d55xt_80",
  $t = "_dialog__input_d55xt_87",
  qt = "_dialog__input_d55xt_87",
  jt = "_dialog__button_d55xt_109",
  Kt = "_dialog__button_d55xt_109",
  m = {
    dialog: Rt,
    dialog__user: Ut,
    dialogUser: At,
    dialog__user_active: Tt,
    dialogUserActive: Ct,
    dialog__user_inactive: kt,
    dialogUserInactive: Bt,
    dialog__messages: Pt,
    dialogMessages: Dt,
    dialog__messages_empty: Ot,
    dialogMessagesEmpty: Ht,
    dialog__divider: Ft,
    dialogDivider: Gt,
    dialog__form: Vt,
    dialogForm: Wt,
    dialog__input: $t,
    dialogInput: qt,
    dialog__button: jt,
    dialogButton: Kt,
  },
  zt = (s) => {
    const e = new Date(s),
      t = e.getHours().toString().padStart(2, "0"),
      o = e.getMinutes().toString().padStart(2, "0");
    return `${t}:${o}`;
  },
  Xt = "_message_fcdvx_1",
  Yt = "_message_from_fcdvx_8",
  Jt = "_message_from_fcdvx_8",
  Zt = "_message__text_fcdvx_13",
  Qt = "_message__text_fcdvx_13",
  es = "_message_to_fcdvx_16",
  ts = "_message_to_fcdvx_16",
  ss = "_message__info_fcdvx_23",
  os = "_message__info_fcdvx_23",
  as = "_message__state_fcdvx_41",
  rs = "_message__state_fcdvx_41",
  w = {
    message: Xt,
    message_from: Yt,
    messageFrom: Jt,
    message__text: Zt,
    messageText: Qt,
    message_to: es,
    messageTo: ts,
    message__info: ss,
    messageInfo: os,
    message__state: as,
    messageState: rs,
  };
class ns {
  constructor(e) {
    a(this, "messageElement");
    a(this, "message");
    a(this, "messageText");
    a(this, "messageDate");
    a(this, "messageLogin");
    a(this, "messageStatus");
    a(this, "messageEdited");
    (this.message = e),
      (this.messageText = this.createMessageText()),
      (this.messageDate = this.createMessageDate()),
      (this.messageLogin = this.createMessageLogin()),
      (this.messageStatus = this.createMessageStatus()),
      (this.messageEdited = this.createMessageEdited()),
      (this.messageElement = this.createMessageElement());
  }
  getMessage() {
    return this.messageElement;
  }
  createMessageText() {
    return g({ className: w.message__text, txt: this.message.text });
  }
  createMessageDate() {
    const e = zt(this.message.datetime);
    return v({ className: w.message__date, txt: e });
  }
  createMessageLogin() {
    const { currentUser: e } = u.getState(),
      t =
        (e == null ? void 0 : e.login) === this.message.from
          ? "You"
          : this.message.from;
    return v({ className: w.message__login, txt: t });
  }
  createMessageStatus() {
    const { isDelivered: e, isReaded: t } = this.message.status;
    let o;
    return (
      e && (o = "delivered"),
      t && (o = "reded"),
      v({ className: w.message__status, txt: o })
    );
  }
  createMessageEdited() {
    const e = this.message.status.isEdited ? "edited" : "";
    return v({ className: w.message__status, txt: e });
  }
  createMessageElement() {
    const e = g({ className: w.message }),
      t = g(
        { className: w.message__info },
        this.messageLogin,
        this.messageDate
      ),
      o = g(
        { className: w.message__state },
        this.messageEdited,
        this.messageStatus
      );
    e.appendChildren([t, this.messageText]);
    const { currentUser: r } = u.getState();
    return (
      (r == null ? void 0 : r.login) === this.message.from
        ? (e.append(o), e.addClasses([w.message_from]))
        : e.addClasses([w.message_to]),
      e
    );
  }
}
class z {
  constructor(e) {
    a(this, "message");
    a(this, "view");
    (this.message = e), (this.view = new ns(this.message));
  }
  getMessageElement() {
    return this.view.getMessage();
  }
}
class is {
  constructor() {
    a(this, "dialogWindow");
    a(this, "dialogUser");
    a(this, "dialogMessages");
    a(this, "messageDivider");
    a(this, "dialogForm");
    a(this, "formInput");
    a(this, "formButton");
    (this.dialogUser = g({ className: m.dialog__user })),
      (this.dialogMessages = g({
        classNames: [m.dialog__messages, m.dialog__messages_empty],
        txt: "Select user to start messaging",
      })),
      (this.messageDivider = g(
        { className: m.dialog__divider },
        v({ txt: "new unread messages" })
      )),
      (this.formInput = _e({
        className: m.dialog__input,
        placeholder: "Enter text here",
        disabled: !0,
      })),
      (this.formButton = U({
        classNames: [m.dialog__button, A.button],
        txt: "Send",
        type: "submit",
        disabled: !0,
      })),
      (this.dialogForm = Z(
        { className: m.dialog__form },
        this.formInput,
        this.formButton
      )),
      (this.dialogWindow = g(
        { className: m.dialog },
        this.dialogUser,
        this.dialogMessages,
        this.dialogForm
      ));
  }
  getDialogWindow() {
    return this.dialogWindow;
  }
  getFormInput() {
    return this.formInput;
  }
  getFormButton() {
    return this.formButton;
  }
  getForm() {
    return this.dialogForm;
  }
  drawMessages(e) {
    this.dialogMessages.getNode().innerHTML = "";
    let t = null;
    const { currentUser: o } = u.getState();
    e != null && e.length
      ? (this.dialogMessages.removeClasses([m.dialog__messages_empty]),
        e.forEach((r) => {
          const n = new z(r);
          this.dialogMessages.append(n.getMessageElement().getNode()),
            !r.status.isReaded &&
              !t &&
              r.to === (o == null ? void 0 : o.login) &&
              (t = n);
        }),
        t instanceof z
          ? (t
              .getMessageElement()
              .getNode()
              .before(this.messageDivider.getNode()),
            this.messageDivider.getNode().scrollIntoView())
          : (this.dialogMessages.getNode().scrollTop =
              this.dialogMessages.getNode().scrollHeight))
      : this.dialogMessages.append(
          g({ className: m.dialog__empty, txt: "Write your first message" })
        );
  }
  enableFormInput() {
    this.formInput.getNode().disabled = !1;
  }
  drawDialogTitle(e) {
    this.dialogUser.removeClasses([
      m.dialog__user_active,
      m.dialog__user_inactive,
    ]);
    const { login: t, isLogined: o } = e;
    this.dialogUser.setTextContent(t);
    const r = o ? m.dialog__user_active : m.dialog__user_inactive;
    this.dialogUser.addClasses([r]);
  }
}
class cs {
  constructor() {
    a(this, "view");
    a(this, "observer", S.getInstance());
    a(this, "socket", I.getInstance());
    (this.view = new is()),
      this.subscribeToEvents(),
      this.setInputHandler(),
      this.setFormHandler();
  }
  getDialogWindow() {
    return this.view.getDialogWindow();
  }
  openDialog() {
    const { currentUserDialogs: e, selectedUser: t } = u.getState(),
      o = e.find((r) => (t == null ? void 0 : t.login) === r.login);
    o && u.dispatch(Re(o)),
      t && this.view.drawDialogTitle(t),
      this.view.enableFormInput(),
      this.drawMessages();
  }
  drawMessages() {
    const { openedDialog: e } = u.getState();
    this.view.drawMessages(e == null ? void 0 : e.messages);
  }
  dialogHandler() {
    const { currentUserDialogs: e, selectedUser: t } = u.getState(),
      o = e.find((n) => (t == null ? void 0 : t.login) === n.login),
      r = o == null ? void 0 : o.messages;
    if (r) {
      const n = r.filter(
        (l) => l.from === (t == null ? void 0 : t.login) && !l.status.isReaded
      );
      n && n.forEach((l) => this.socket.sendMessage(J(l)));
    }
  }
  updateDialogTitle(e) {
    var o;
    const t = L(e);
    if (t) {
      const { openedDialog: r } = u.getState(),
        n = (o = t.payload) == null ? void 0 : o.user;
      n &&
        (n == null ? void 0 : n.login) === (r == null ? void 0 : r.login) &&
        this.view.drawDialogTitle(n);
    }
  }
  setInputHandler() {
    const e = this.view.getFormInput(),
      t = this.view.getFormButton().getNode();
    e.addListener("input", () => {
      t.disabled = !e.getNode().value;
    }),
      e.addListener("keydown", (o) => {
        o.key === "Enter" && (o.preventDefault(), this.formHandler());
      });
  }
  setFormHandler() {
    this.view.getForm().addListener("submit", (t) => {
      t.preventDefault(), this.formHandler();
    });
  }
  formHandler() {
    const e = this.view.getFormInput(),
      { value: t } = e.getNode(),
      o = this.view.getFormButton().getNode();
    t && (this.sendMessage(t), (e.getNode().value = ""), (o.disabled = !0));
  }
  sendMessage(e) {
    const { selectedUser: t } = u.getState();
    if (t) {
      const o = { to: t == null ? void 0 : t.login, text: e };
      this.socket.sendMessage(ce(o));
    }
  }
  handleReadResponse(e) {
    const t = L(e);
    if (t) {
      const { openedDialog: o } = u.getState();
      (o == null
        ? void 0
        : o.messages.find((n) => {
            var l, d;
            return (
              ((d = (l = t.payload) == null ? void 0 : l.message) == null
                ? void 0
                : d.id) === n.id
            );
          })) && this.drawMessages();
    }
  }
  subscribeToEvents() {
    this.observer.subscribe(i.openDialog, () => this.openDialog()),
      this.observer.subscribe(i.messageSend, () => this.drawMessages()),
      this.observer.subscribe(i.messageRead, (t) => this.handleReadResponse(t)),
      this.observer.subscribe(i.externalLogoutResponse, (t) =>
        this.updateDialogTitle(t)
      ),
      this.observer.subscribe(i.externalLoginResponse, (t) =>
        this.updateDialogTitle(t)
      );
    const e = this.view.getDialogWindow();
    e.addListener("click", () => this.dialogHandler()),
      e.addListener("wheel", () => this.dialogHandler());
  }
}
const ls = "_main-page_r8hg3_1",
  gs = "_content_r8hg3_7",
  X = { "main-page": "_main-page_r8hg3_1", mainPage: ls, content: gs };
class ds {
  constructor(e, t, o, r) {
    a(this, "page");
    a(this, "header");
    a(this, "footer");
    a(this, "userList");
    a(this, "dialogWindow");
    (this.header = e),
      (this.footer = t),
      (this.userList = o),
      (this.dialogWindow = r);
    const n = ge({ className: X.content });
    n.appendChildren([this.userList.getNode(), this.dialogWindow.getNode()]),
      (this.page = g({ classNames: [X.mainPage] })),
      this.page.appendChildren([
        this.header.getNode(),
        n,
        this.footer.getNode(),
      ]);
  }
  getPage() {
    return this.page.getNode();
  }
}
class us {
  constructor(e) {
    a(this, "view");
    a(this, "header");
    a(this, "footer");
    a(this, "userList");
    a(this, "dialogWindow");
    a(this, "router");
    a(this, "sessionStorageService", E.getInstance());
    (this.router = e),
      (this.header = new mt(this.router)),
      (this.footer = new at()),
      (this.userList = new xt()),
      (this.dialogWindow = new cs()),
      (this.view = new ds(
        this.header.getHeader(),
        this.footer.getFooter(),
        this.userList.getUserList(),
        this.dialogWindow.getDialogWindow()
      ));
  }
  openPage(e) {
    this.sessionStorageService.getData("user")
      ? e.append(this.getPage())
      : this.router.navigateTo(f.LOGIN);
  }
  getPage() {
    return this.view.getPage();
  }
}
class _s {
  constructor() {
    a(this, "pagesContainer");
    this.pagesContainer = g({ className: "site-wrapper" });
  }
  getHTML() {
    return this.pagesContainer.getNode();
  }
}
class hs {
  constructor() {
    a(this, "view");
    a(this, "root");
    a(this, "waiter");
    a(this, "router", new se());
    a(this, "observer", S.getInstance());
    a(this, "sessionStorageService", E.getInstance());
    a(this, "socket", I.getInstance());
    (this.view = new _s()),
      (this.root = this.getHTML()),
      (this.waiter = new Me(this.root)),
      this.setConnectionWaiter(),
      this.initPages(),
      console.log(
        "Привет, если есть возможность, можешь проверить позже, активно дорабатываю всё что не успел. Можешь связаться со мной в Discord (@prakapro), затягивать не буду"
      );
  }
  getHTML() {
    return this.view.getHTML();
  }
  initPages() {
    const e = new Ze(this.router),
      t = new us(this.router),
      o = new ye(),
      r = [
        {
          path: f.LOGIN,
          callback: () => {
            (this.root.innerHTML = ""), e.openPage(this.root);
          },
        },
        {
          path: f.MAIN,
          callback: () => {
            (this.root.innerHTML = ""), t.openPage(this.root);
          },
        },
        {
          path: f.ABOUT,
          callback: () => {
            (this.root.innerHTML = ""), o.openPage(this.root);
          },
        },
      ];
    this.router.setRoutes(r);
  }
  checkAuth() {
    const e = this.sessionStorageService.getData("user");
    return e && this.socket.sendMessage(Y(e)), !!e;
  }
  redirectUser() {
    this.checkAuth()
      ? this.router.navigateTo(f.MAIN)
      : this.router.navigateTo(f.LOGIN);
  }
  setConnectionWaiter() {
    this.observer.subscribe(i.socketOpen, () => {
      this.waiter.hideWaiter(), this.redirectUser();
    }),
      this.observer.subscribe(i.socketClose, () => this.waiter.showWaiter());
  }
}
const ms = new hs();
document.body.append(ms.getHTML());
