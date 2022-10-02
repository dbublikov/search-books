import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearControls } from '../controls/controls-slice';
import { initLoad, loadMore, selectBooks, selectBooksInfo } from './books-slice';

import { Card } from '../../components/Card';
import { List } from '../../components/List';
import { LoadMoreButton } from '../../components/Buttons';
import { Loader } from '../../components/Loader';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const BooksList = () => {
  const books = useSelector(selectBooks);
  const { status, error, qty, pagination } = useSelector(selectBooksInfo);
  const { currIndex, pageTerm, step } = pagination;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!qty) {
      dispatch(initLoad());
    }

    return () => {
      dispatch(clearControls());
    };
  }, [qty, dispatch]);

  return (
    <Wrapper>
      {
        status === 'received' && (
          <List>
            {books.map(({ id, volumeInfo }) => {
              return (
                <Card
                  key={id}
                  id={id}
                  onClick={() => navigate(`/book/${id}`)}
                  {...volumeInfo}
                />
              );
            })}
          </List>
        )
      }
      {(error || pagination.error) && <Loader>Can't fetch data from the server =( </Loader>}
      {(status === 'loading') && <Loader pos={true} />}
      {(pagination.status === 'loading') && <Loader pos={null} />}
      {pageTerm && (currIndex <= qty-step) && pagination.status !== 'loading'
        && <LoadMoreButton onClick={() => dispatch(loadMore())}>Load more</LoadMoreButton>}
    </Wrapper>
  );
};
