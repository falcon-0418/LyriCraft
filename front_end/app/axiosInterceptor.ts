import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 保留中のリクエストを保存するためのマップ
const pendingRequests = new Map();

// リクエストを一意に識別するキーを生成する関数
function getRequestIdentifier(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

// リクエストインターセプタ
axios.interceptors.request.use(config => {
  const requestIdentifier = getRequestIdentifier(config);
  if (pendingRequests.has(requestIdentifier)) {
    // 既に保留中のリクエストがある場合は、新しいリクエストをキャンセル
    config.cancelToken = new axios.CancelToken(cancel => cancel('Duplicate request detected.'));
  } else {
    // キャンセルトークンを設定して、後でリクエストをキャンセルできるようにする
    config.cancelToken = new axios.CancelToken(cancel => pendingRequests.set(requestIdentifier, cancel));
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// レスポンスインターセプタ
axios.interceptors.response.use(response => {
  const requestIdentifier = getRequestIdentifier(response.config);
  // リクエストが完了したので、保留中のリクエストマップから削除
  pendingRequests.delete(requestIdentifier);
  return response;
}, error => {
  if (axios.isCancel(error)) {
    // ここで重複リクエストのキャンセルを検知できる
    console.log('Request canceled:', error.message);
  } else {
    // その他のエラー処理
    const requestIdentifier = getRequestIdentifier(error.config);
    pendingRequests.delete(requestIdentifier);
  }
  return Promise.reject(error);
});
