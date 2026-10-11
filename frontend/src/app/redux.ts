import type { AppDispatch, RootState } from '@/app/store';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export type AppThunk<TResult = Promise<void>> = ThunkAction<TResult, RootState, unknown, UnknownAction>;
