import React from 'react';
import { Modal, Form, Select, Input, Button, Space } from 'antd';

const { TextArea } = Input;

const CORRECTION_TYPES = [
  '到货日期',
  '每磅价格',
  '每公斤价格',
  '首重价格',
  '续重价格',
  '时效',
  '公司名称',
  '其他',
];

const PLACEHOLDERS: Record<string, string> = {
  '到货日期':   '例：2024-03-15',
  '每磅价格':   '例：52（元/磅）',
  '每公斤价格': '例：29（元/kg）',
  '首重价格':   '例：¥96/0.5kg',
  '续重价格':   '例：¥29/kg',
  '时效':       '例：3-5 天',
  '公司名称':   '例：正确公司全称',
  '其他':       '请填写建议值',
};

export interface CorrectionFormValues {
  correctionType: string;
  suggestedValue: string;
  notes: string;
  contactEmail?: string;
}

interface CorrectionModalProps {
  open: boolean;
  onClose: () => void;
  record: Record<string, unknown>;
  source: 'air' | 'sea';
  onSubmit: (values: CorrectionFormValues) => void;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({
  open,
  onClose,
  record,
  onSubmit,
}) => {
  const [form] = Form.useForm<CorrectionFormValues>();
  const corrType = Form.useWatch('correctionType', form);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="提交纠错 / 更新建议"
      open={open}
      onCancel={handleCancel}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleOk}>提交</Button>
        </Space>
      }
    >
      {/* 当前行信息提示 */}
      <div style={{
        background: '#f5f5f5',
        borderRadius: 6,
        padding: '8px 12px',
        marginBottom: 16,
        fontSize: 13,
        color: '#555',
      }}>
        公司：<strong>{String(record.company ?? '-')}</strong>
        　类型：<strong>{String(record.type ?? '-')}</strong>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="correctionType"
          label="纠错类型"
          rules={[{ required: true, message: '请选择纠错类型' }]}
        >
          <Select placeholder="选择需要纠错的字段">
            {CORRECTION_TYPES.map((t) => (
              <Select.Option key={t} value={t}>{t}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="suggestedValue"
          label="建议的正确值"
          rules={[{ required: true, message: '请填写建议值' }]}
        >
          <Input
            placeholder={corrType ? PLACEHOLDERS[corrType] : '请先选择纠错类型'}
            disabled={!corrType}
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="备注说明"
          rules={[
            { required: true, message: '请填写备注说明' },
            { min: 10, message: '备注至少 10 个字符' },
          ]}
        >
          <TextArea
            rows={3}
            showCount
            maxLength={500}
            placeholder="请说明纠错依据（例如：来源截图/官方公告等）"
          />
        </Form.Item>

        <Form.Item
          name="contactEmail"
          label="联系邮箱（选填，方便我们回复确认）"
          rules={[{ type: 'email', message: '请输入有效邮箱' }]}
        >
          <Input placeholder="your@email.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CorrectionModal;
