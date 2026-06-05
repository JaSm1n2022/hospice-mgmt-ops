import { all } from 'redux-saga/effects';
import QAHandler from '../../views/Administrator/OperationsMgmt/QAMonitoring/handler/QAHandler';

export default function* qaSaga() {
  yield all([QAHandler()]);
}
