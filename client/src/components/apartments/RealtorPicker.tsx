import {
  AutoComplete,
  Form,
} from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { UserPickerViewModel } from "../../viewmodels/components/userpicker";
import "./RealtorPicker.scss";

@observer
export class RealtorPicker extends React.Component<{
  userPicker: UserPickerViewModel,
  label: string,
}> {
  public render() {
    return (
      <Form.Item className="RealtorPicker" label={this.props.label}>
        <AutoComplete
          placeholder="Type the name of a realtor"
          value={this.props.userPicker.name}
          fetchSuggestions={async (query, callback) => {
            const name = query || "";
            this.props.userPicker.name = name;
            const users = await this.props.userPicker.fetchSuggestions();
            if (callback) {
              callback(users);
            }
          }}
          onSelect={this.props.userPicker.pick}
        />
      </Form.Item>
    );
  }
}
