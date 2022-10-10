/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import { Card, Image } from 'antd';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
import SystemInfoSvg from '../../../public/image/system-info.svg';

const { Meta } = Card;

export default function version() {
  return (
    <PageLayout
      title={
        <>
          <Icon component={SystemInfoSvg as any} /> 联系我们
        </>
      }
      hideCluster
    >
      <div style={{ padding: 10 }}>
        <div style={{ padding: 20 }}>
          <ul style={{ paddingLeft: 10 }}>
            <li>
              我们的联式方式：
              <a href='https://www.jgdt.com/' target='_blank'>
              https://www.jgdt.com/
              </a>
            </li>
            {/* <li>
              文档国内地址：
              <a href='https://n9e.gitee.io/' target='_blank'>
                https://n9e.gitee.io/
              </a>
            </li> */}
          </ul>
          <div style={{ display: 'flex' }}>
            {/* <Card style={{ width: 250, marginRight: 10 }} cover={<Image style={{ border: '1px solid #efefef', height: 305 }} preview={false} src={'/image/wx_n9e.png'} />}>
              <Meta title={<div style={{ textAlign: 'center' }}>微信公众号</div>} />
            </Card> */}
            {/* <Card style={{ width: 250, marginRight: 10 }} cover={<Image style={{ border: '1px solid #efefef', height: 305 }} preview={false} src={'/image/dingtalk.png'} />}>
              <Meta title={<div style={{ textAlign: 'center' }}>钉钉交流群</div>} />
            </Card>
            <Card style={{ width: 250 }} cover={<Image style={{ border: '1px solid #efefef', height: 305 }} preview={false} src={'/image/zhihu.png'} />}>
              <Meta title={<div style={{ textAlign: 'center' }}>知乎话题</div>} />
            </Card> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
