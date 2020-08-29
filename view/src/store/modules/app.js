import { getCookie, setCookie } from '@/utils/cookie-utils';
const state = {
  sidebar: {
    opened: getCookie('sidebarStatus') ? !!+getCookie('sidebarStatus') : true
  }
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    if (state.sidebar.opened) {
      setCookie('sidebarStatus', 1);
    } else {
      setCookie('sidebarStatus', 0);
    }
  },
  OPEN_SIDEBAR: state => {
    setCookie('sidebarStatus', 1);
    state.sidebar.opened = true;
  },
  CLOSE_SIDEBAR: (state) => {
    setCookie('sidebarStatus', 0);
    state.sidebar.opened = false;
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  openSideBar({ commit }) {
    commit('OPEN_SIDEBAR');
  },
  closeSideBar({ commit }) {
    commit('CLOSE_SIDEBAR');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
