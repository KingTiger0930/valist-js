import { getBlockExplorer } from '@/components/Activity';
import { ApolloCache } from '@apollo/client';
import { ethers } from 'ethers';
import { Anchor } from '@mantine/core';
import { Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';
import { normalizeError } from './common';

export async function setProductRoyalty(
  address: string | undefined,
  projectId: string,
  recipient: string,
  amount: number,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Creating transaction');
    const transaction = await valist.setProductRoyalty(projectId, recipient, amount);

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}

export async function setProductLimit(
  address: string | undefined,
  projectId: string,
  limit: number,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Creating transaction');
    const transaction = await valist.setProductLimit(projectId, limit);

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}

export async function setProductPrice(
  address: string | undefined,
  projectId: string,
  token: string,
  price: string,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Creating transaction');
    const transaction = token === ethers.constants.AddressZero
      ? await valist.setProductPrice(projectId, price)
      : await valist.setProductTokenPrice(token, projectId, price);
    
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError((error)));
  } finally {
    utils.hideLoading();
  }
}

export async function withdrawProductBalance(
  address: string | undefined,
  projectId: string,
  token: string,
  recipient: string,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
    try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = token === ethers.constants.AddressZero
      ? await valist.withdrawProductBalance(projectId, recipient)
      : await valist.withdrawProductTokenBalance(token, projectId, recipient);
    
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);
    
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}
