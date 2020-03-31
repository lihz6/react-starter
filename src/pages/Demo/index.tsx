import React, { useState, useEffect } from 'react';

import withPath from '_base/withPath';
import UxSpin from '_view/UxSpin';

import { fetchFrom } from './fetch';

export const defaultParams = { page: 1, size: 10 };
export const defaultQuery = { keyword: '' };

export default withPath(
  PAGEPATH,
  defaultParams,
  defaultQuery
)(({ match: { params, query, pathOf }, history }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFrom(params, query).then(() => {
      setLoading(false);
    });
  }, [params, query]);

  const onClick = () => {
    history.push(pathOf({ ...params, page: params.page + 1 }, query));
  };

  return (
    <UxSpin spinning={loading}>
      <div onClick={onClick}>Demo: Next Page</div>
    </UxSpin>
  );
});
