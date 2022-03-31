import React, { useEffect, useMemo, useRef, useState } from 'react';
import PageLayout from '@/components/pageLayout';
import { AlertOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LeftTree from '@/components/LeftTree';
import DataTable from '@/components/Dantd/components/data-table';
import moment from 'moment';
import { Button, Input, Modal, Tag, Tooltip } from 'antd';
import DateRangePicker, { RelativeRange } from '@/components/DateRangePicker';
import { priorityColor } from '@/utils/constant';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/common';
import { eventStoreState } from '@/store/eventInterface';
import { CommonStoreState } from '@/store/commonInterface';
import BlankBusinessPlaceholder from '@/components/BlankBusinessPlaceholder';
import ColumnSelect from '@/components/ColumnSelect';
import '../event/index.less';
import { SeverityColor } from '../event';

const Event: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tableRef = useRef({
    handleReload() {},
  });
  const { hisHourRange, hisQueryContent } = useSelector<RootState, eventStoreState>((state) => state.event);
  const [hisSeverity, setHisSeverity] = useState<number>();
  const [hisEventType, setHisEventType] = useState<number>();
  const [curClusterItems, setCurClusterItems] = useState<string[]>([]);
  const isAddTagToQueryInput = useRef(false);
  const [curBusiId, setCurBusiId] = useState<number>(-1);
  const DateRangeItems: RelativeRange[] = useMemo(
    () => [
      { num: 6, unit: 'hours', description: t('hours') },
      { num: 12, unit: 'hours', description: t('hours') },
      { num: 1, unit: 'day', description: t('天') },
      { num: 2, unit: 'days', description: t('天') },
      { num: 3, unit: 'days', description: t('天') },
      { num: 7, unit: 'days', description: t('天') },
      { num: 14, unit: 'days', description: t('天') },
      { num: 30, unit: 'days', description: t('天') },
      { num: 60, unit: 'days', description: t('天') },
      { num: 90, unit: 'days', description: t('天') },
    ],
    [],
  );

  const columns = [
    {
      title: t('集群'),
      dataIndex: 'cluster',
      width: 120,
    },
    // {
    //   title: t('级别'),
    //   dataIndex: 'severity',
    //   width: 70,
    //   render: (severity) => {
    //     return <Tag color={priorityColor[severity - 1]}>S{severity}</Tag>;
    //   },
    // },
    {
      title: t('类别'),
      dataIndex: 'is_recovered',
      width: 110,
      render(isRecovered) {
        return <Tag color={isRecovered ? 'green' : 'red'}>{isRecovered ? 'Recovered' : 'Triggered'}</Tag>;
      },
    },
    {
      title: t('规则标题&事件标签'),
      dataIndex: 'rule_name',
      render(title, { id, tags }) {
        const content =
          tags &&
          tags.map((item) => (
            <Tag
              color='blue'
              key={item}
              onClick={(e) => {
                if (!hisQueryContent.includes(item)) {
                  isAddTagToQueryInput.current = true;
                  saveData('hisQueryContent', hisQueryContent ? `${hisQueryContent.trim()} ${item}` : item);
                }
              }}
            >
              {item}
            </Tag>
          ));
        return (
          <>
            <div>
              <a style={{ padding: 0 }} onClick={() => history.push(`/alert-his-events/${id}`)}>
                {title}
              </a>
            </div>
            <div>
              <span className='event-tags'>{content}</span>
            </div>
          </>
        );
      },
    },

    {
      title: t('计算时间'),
      dataIndex: 'last_eval_time',
      width: 120,
      render(value) {
        return moment((value ? value : 0) * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  function renderLeftHeader() {
    return (
      <div className='table-operate-box'>
        <div className='left'>
          <DateRangePicker
            showRight={false}
            leftList={DateRangeItems}
            value={hisHourRange}
            onChange={(range: RelativeRange) => {
              if (range.num !== hisHourRange.num || range.unit !== hisHourRange.unit) {
                saveData('hisHourRange', range);
              }
            }}
          />
          <ColumnSelect
            onSeverityChange={(e) => setHisSeverity(e)}
            onEventTypeChange={(e) => setHisEventType(e)}
            onBusiGroupChange={(e) => setCurBusiId(typeof e === 'number' ? e : -1)}
            onClusterChange={(e) => setCurClusterItems(e)}
          />
          <Input
            className='search-input'
            prefix={<SearchOutlined />}
            placeholder='模糊搜索规则和标签(多个关键词请用空格分隔)'
            value={hisQueryContent}
            onChange={(e) => saveData('hisQueryContent', e.target.value)}
            onPressEnter={(e) => tableRef.current.handleReload()}
          />
        </div>
      </div>
    );
  }

  function saveData(prop, data) {
    dispatch({
      type: 'event/saveData',
      prop,
      data,
    });
  }

  useEffect(() => {
    if (isAddTagToQueryInput.current) {
      tableRef.current.handleReload();
      isAddTagToQueryInput.current = false;
    }
  }, [hisQueryContent]);

  useEffect(() => {
    tableRef.current.handleReload();
  }, [curClusterItems, hisSeverity, hisHourRange, hisEventType, curBusiId]);

  return (
    <PageLayout icon={<AlertOutlined />} title={t('历史告警')} hideCluster>
      <div className='event-content'>
        <div className='table-area'>
          <DataTable
            ref={tableRef}
            antProps={{
              rowKey: 'id',
              rowClassName: (record: { severity: number }, index) => {
                return SeverityColor[record.severity - 1];
              },
              // scroll: { x: 'max-content' },
            }}
            url={`/api/n9e/alert-his-events/list`}
            customQueryCallback={(data) =>
              Object.assign(
                data,
                { hours: hisHourRange.unit !== 'hours' ? hisHourRange.num * 24 : hisHourRange.num },
                curClusterItems.length ? { clusters: curClusterItems.join(',') } : {},
                hisSeverity !== undefined ? { severity: hisSeverity } : {},
                hisQueryContent ? { query: hisQueryContent } : {},
                hisEventType !== undefined ? { is_recovered: hisEventType } : {},
                { bgid: curBusiId },
              )
            }
            pageParams={{
              curPageName: 'p',
              pageSizeName: 'limit',
              pageSize: 30,
              pageSizeOptions: ['30', '100', '200', '500'],
            }}
            apiCallback={({ dat: { list: data, total } }) => ({
              data,
              total,
            })}
            columns={columns}
            reloadBtnType='btn'
            reloadBtnPos='left'
            filterType='flex'
            leftHeader={renderLeftHeader()}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Event;
