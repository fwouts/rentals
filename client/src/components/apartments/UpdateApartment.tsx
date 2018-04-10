import { Button, Card, Checkbox, Form, InputNumber } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { UpdateApartmentViewModel } from "../../viewmodels/authenticated/states/apartments/update";
import { RealtorPicker} from "./RealtorPicker";

@observer
export class UpdateApartment extends React.Component<{
  viewModel: UpdateApartmentViewModel,
}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Update apartment listing
        </h1>}
      >
        <Form
          model={this.props.viewModel.apartmentInfo}
          labelWidth="200"
          {...{onSubmit: this.onSubmit} as any}
        >
          <Form.Item label="Floor area (m2)" required={true}>
            <InputNumber
              defaultValue={this.props.viewModel.apartmentInfo.floorArea}
              value={this.props.viewModel.apartmentInfo.floorArea}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.floorArea = value}
            />
          </Form.Item>
          <Form.Item label="Price per month (USD)" required={true}>
            <InputNumber
              defaultValue={this.props.viewModel.apartmentInfo.pricePerMonth}
              value={this.props.viewModel.apartmentInfo.pricePerMonth}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.pricePerMonth = value}
            />
          </Form.Item>
          <Form.Item label="Number of rooms" required={true}>
            <InputNumber
              defaultValue={this.props.viewModel.apartmentInfo.numberOfRooms}
              value={this.props.viewModel.apartmentInfo.numberOfRooms}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.numberOfRooms = value}
            />
          </Form.Item>
          <Form.Item label="Latitude" required={true}>
            <InputNumber
              defaultValue={this.props.viewModel.apartmentInfo.coordinates.latitude}
              value={this.props.viewModel.apartmentInfo.coordinates.latitude}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.coordinates.latitude = value}
            />
          </Form.Item>
          <Form.Item label="Longitude" required={true}>
            <InputNumber
              defaultValue={this.props.viewModel.apartmentInfo.coordinates.longitude}
              value={this.props.viewModel.apartmentInfo.coordinates.longitude}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.coordinates.longitude = value}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              label="Rented"
              checked={this.props.viewModel.apartmentInfo.rented}
              onChange={(value: any) => this.props.viewModel.apartmentInfo.rented = value}
            />
          </Form.Item>
          {this.props.viewModel.realtorPicker && (
            <RealtorPicker
              userPicker={this.props.viewModel.realtorPicker}
              label="Assign to a realtor"
            />
          )}
          <Form.Item>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Create</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.viewModel.submit();
    e.preventDefault();
  }
}
