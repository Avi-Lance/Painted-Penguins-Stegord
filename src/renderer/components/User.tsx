import { Button } from 'antd';

export default function User({ name }) {
  return (
    <div className="user_list_item">
      <p>{name}</p>
      <Button type="primary">Add as Friend</Button>
    </div>
  );
}
