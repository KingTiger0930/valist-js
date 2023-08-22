import { ApolloCache } from '@apollo/client';
import * as utils from './utils';
import { Client, ProjectMeta } from "@valist/sdk";
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';
import { handleEvent } from './events';
import { normalizeError } from './common';

export async function unlinkRepo(
  address: string | undefined,
  projectId: string,
  projectMeta: ProjectMeta,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
) {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }
    utils.showLoading('Creating transaction');
    const transaction = await valist.setProjectMeta(projectId, { ...projectMeta, repository: undefined });
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}