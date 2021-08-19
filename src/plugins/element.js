import Vue from 'vue'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import {
  Button,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  Upload,
  Message,
  Dialog,
  Image,
  Form,
  FormItem,
  Tag,
  Radio,
  RadioGroup,
  Loading,
  Steps,
  Step,
  DatePicker,
  TimeSelect,
  TimePicker,
  Table,
  TableColumn,
  Progress,
  Tooltip,
  MessageBox,
  Notification,
  Pagination,
  Popover,
  Container,
  Header,
  Aside,
  Main,
  Row,
  Col,
  Autocomplete
} from 'element-ui'

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Image);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tag);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Loading);
Vue.use(Steps);
Vue.use(Step);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Progress);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Popover);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Autocomplete);

// In order to realize the private properties of Class
const showMessage = Symbol('showMessage')
/**
 * Rewrite Message of ElementUI*
 *  The default value of single is true, because of project requirements, only one pops up by default, which can be set according to actual needs
 */
class DonMessage {
  success(options, single = true) {
    this[showMessage]('success', options, single)
  }
  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }
  info(options, single = true) {
    this[showMessage]('info', options, single)
  }
  error(options, single = true) {
    this[showMessage]('error', options, single)
  } [showMessage](type, options, single) {
    if (single) {
      // Determine whether Message already exists
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}

// 将 Message 直接挂在 Vue 实例上
Vue.prototype.$message = new DonMessage()
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;