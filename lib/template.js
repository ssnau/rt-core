import Mustache from 'mustache';

export default function tpl(string, data) {
  return Mustache.render('{{=<$$ $$>=}}' + string, data);
}
