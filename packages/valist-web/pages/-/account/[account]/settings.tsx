import type { NextPage } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { useForm, zodResolver } from '@mantine/form';
import { Layout } from '@/components/Layout';
import { AddressInput } from '@/components/AddressInput';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import query from '@/graphql/UpdateAccountPage.graphql';

import { 
  schema,
  FormValues,
  updateAccount,
  addAccountMember, 
  removeAccountMember ,
} from '@/forms/update-account';

import {
  Title,
  Text,
  Stack,
  Group,
  List,
  TextInput,
  Tabs,
} from '@mantine/core';

import { 
  Button,
  Breadcrumbs,
  ImageInput,
  MemberList,
  _404,
} from '@valist/ui';
import { AccountMeta } from '@valist/sdk';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();
  const valist = useValist();

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const { data, loading:gqLoading } = useQuery(query, { variables: { accountId } });
  const { data: meta } = useSWRImmutable<AccountMeta>(data?.account?.metaURI);

  const members = data?.account?.members ?? [];

  // form values
  const openRef = useRef<() => void>(null);
  const [loading, setLoading] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const [image, setImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File>();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      displayName: '',
      website: '',
      description: '',
    },
  });

  // wait for metadata to load
  useEffect(() => {
    if (meta) {
      meta.name && form.setFieldValue('displayName', meta.name);
      meta.external_url && form.setFieldValue('website', meta.external_url);
      meta.description && form.setFieldValue('description', meta.description);
      meta.image && setImage(meta.image);
      setLoading(false);
    }
  }, [meta]);

  useEffect(() => {
    const prevMeta = JSON.stringify(meta)?.split('').sort().join('');
    const curMeta = JSON.stringify({
      name: form.values.displayName,
      description: form.values.description,
      external_url: form.values.website,
      image: meta?.image,
    }).split('').sort().join('');
    setSubmitDisabled(!newImage && prevMeta == curMeta);
  }, [form.values, meta, newImage]);

  const removeMember = (member: string) => {
    setLoading(true);
    removeAccountMember(
      address,
      accountId,
      member,
      valist,
      cache,
      chainId,
    ).finally(() => {
      setLoading(false);
    });
  };

  const addMember = (member: string) => {
    setLoading(true);
    addAccountMember(
      address,
      accountId,
      member,
      valist,
      cache,
      chainId,
    ).finally(() => {
      setLoading(false);
    });
  };

  const update = (values: FormValues) => {
    setLoading(true);
    updateAccount(
      address,
      accountId,
      newImage,
      values,
      valist,
      cache,
      chainId,
    ).finally(() => {
      setLoading(false);  
    });
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: 'Settings', href: `/-/${accountName}/settings` },
  ];

  if (!gqLoading && !data?.account) {
    return (
      <Layout>
        <_404 
          message={"The account you are looking for doesn't seem to exist, no biggie click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/create/account`)}>Create account</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Tabs defaultValue="basic">
        <Tabs.List grow>
          <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic">
          <form onSubmit={form.onSubmit(update)}>
            <Stack style={{ maxWidth: 784 }}>
              <Title mt="lg">Basic Info</Title>
              <Text color="dimmed">This is your public account info.</Text>
              <Group spacing={40} grow>
                <ImageInput 
                  width={300}
                  height={300}
                  onChange={setNewImage} 
                  value={newImage || image}
                  disabled={loading}
                  openRef={openRef}
                />
                <Stack align="flex-start">
                  <Title order={2}>Account Image</Title>
                  <Text>
                    Click below to upload or drag and drop. 
                    Formats available are SVG, PNG, JPG (max. 800x800px)
                  </Text>
                  <Button onClick={() => openRef?.current?.()}>
                    Change Image
                  </Button>
                </Stack>
              </Group>
              <Title order={2}>Account Details</Title>
              <TextInput 
                label="Account Name (cannot be changed)"
                value={accountName}
                disabled
              />
              <TextInput 
                label="Display Name"
                disabled={loading}
                required 
                {...form.getInputProps('displayName')}
              />
              <TextInput 
                label="Website"
                disabled={loading}
                {...form.getInputProps('website')}
              />
              <TextInput
                label="Description"
                disabled={loading}
                {...form.getInputProps('description')}
              />
            </Stack>
            <Group mt="lg">
              <Button 
                disabled={submitDisabled || loading} 
                type="submit"
              >
                Save
              </Button>
            </Group>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Members</Title>
            <Text color="dimmed">Members can perform the following actions:</Text>
            <List>
              <List.Item>Update account info</List.Item>
              <List.Item>Add or remove account members</List.Item>
              <List.Item>Create new projects</List.Item>
              <List.Item>Add or remove project members</List.Item>
              <List.Item>Update project info</List.Item>
              <List.Item>Publish new releases</List.Item>
            </List>
            <Title order={2}>Account Admins</Title>
            <AddressInput
              onSubmit={addMember}
              disabled={loading}
            />
            <MemberList
              label="Account Admin"
              members={members.map((member: any) => member.id)}
              onRemove={removeMember}
              editable={!loading}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;