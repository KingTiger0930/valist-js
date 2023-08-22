import { ApolloCache } from '@apollo/client';
import { ethers } from 'ethers';
import { Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';
import { normalizeError } from './common';

export async function purchaseProduct(
  address: string | undefined,
  projectId: string,
  token: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = token === ethers.constants.AddressZero
      ? await valist.purchaseProduct(projectId, address)
      : await valist.purchaseProductToken(token, projectId, address);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}