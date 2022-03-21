import { allLocalesLoader } from '../i18n/all-locale-loader';
import { ExpressionDescriptor } from './expression-descriptor';

ExpressionDescriptor.initialize(new allLocalesLoader());
export default ExpressionDescriptor;

const toString = ExpressionDescriptor.toString;
export { toString };
