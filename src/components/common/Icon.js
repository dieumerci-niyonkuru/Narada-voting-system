import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartBar, faUsers, faList, faVoteYea, faTrophy, faFileAlt,
  faArrowLeft, faHome, faSignOutAlt, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faInfoCircle, faPlay, faStop, faUser,
  faUserCog, faPhone, faEnvelope, faLock, faUnlock, faEye, faEyeSlash,
  faPlus, faEdit, faTrash, faSave, faTimes, faCheck, faCalendarAlt,
  faClock, faGithub, faLinkedin, faTwitter, faCog, faQuestionCircle,
  faSearch, faFilter, faDownload, faUpload, faSync, faSpinner,
  faChartPie, faBarChart, faUserPlus, faUserCheck, faUserMinus,
  faKey, faIdCard, faAddressCard, faClipboardList, faPoll, faPollH,
  faArrowUp, faArrowDown, faWifi, faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { faGithub as faGithubBrand, faLinkedin as faLinkedinBrand, faTwitter as faTwitterBrand } from '@fortawesome/free-brands-svg-icons'

const iconMap = {
  dashboard: faChartBar,
  members: faUsers,
  positions: faList,
  sessions: faVoteYea,
  winners: faTrophy,
  reports: faFileAlt,
  vote: faVoteYea,
  login: faKey,
  logout: faSignOutAlt,
  back: faArrowLeft,
  home: faHome,
  success: faCheckCircle,
  error: faTimesCircle,
  warning: faExclamationTriangle,
  info: faInfoCircle,
  loading: faSpinner,
  pending: faClock,
  approved: faCheckCircle,
  rejected: faTimesCircle,
  active: faPlay,
  inactive: faStop,
  candidate: faUser,
  position: faList,
  voteButton: faVoteYea,
  results: faPoll,
  chart: faChartBar,
  pie: faChartPie,
  bar: faBarChart,
  phone: faPhone,
  email: faEnvelope,
  user: faUser,
  admin: faUserCog,
  member: faUsers,
  add: faPlus,
  edit: faEdit,
  delete: faTrash,
  save: faSave,
  cancel: faTimes,
  approve: faCheck,
  reject: faTimes,
  start: faPlay,
  stop: faStop,
  calendar: faCalendarAlt,
  time: faClock,
  github: faGithubBrand,
  linkedin: faLinkedinBrand,
  twitter: faTwitterBrand,
  settings: faCog,
  help: faQuestionCircle,
  search: faSearch,
  filter: faFilter,
  download: faDownload,
  upload: faUpload,
  refresh: faSync,
  lock: faLock,
  unlock: faUnlock,
  eye: faEye,
  eyeOff: faEyeSlash,
  userPlus: faUserPlus,
  userCheck: faUserCheck,
  userMinus: faUserMinus,
  key: faKey,
  idCard: faIdCard,
  addressCard: faAddressCard,
  clipboard: faClipboardList,
  trendUp: faArrowUp,
  trendDown: faArrowDown,
  online: faWifi,
  chartLine: faChartLine
}

function Icon({ name, className = "", size = "text-base", spin = false }) {
  const icon = iconMap[name]
  
  if (!icon) {
    return <span className={className}>í³Œ</span>
  }
  
  return (
    <FontAwesomeIcon 
      icon={icon} 
      className={`${className} ${spin ? 'animate-spin' : ''}`}
    />
  )
}

export default Icon
