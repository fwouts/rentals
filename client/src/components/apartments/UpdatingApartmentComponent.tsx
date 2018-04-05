import { Alert, Button, Checkbox, Form, InputNumber, Loading } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { UpdatingApartment } from "../../state/authenticated/states/apartments/updating";

@observer
export class UpdatingApartmentComponent extends React.Component<{
  controller: UpdatingApartment,
}> {
  public render() {
    return (
      <div>
        <h1>
          Update apartment listing
        </h1>
        {this.props.controller.pending && <Loading fullscreen={true} />}
        <Form
          model={this.props.controller.apartmentInfo}
          labelWidth="200"
          {...{onSubmit: this.onSubmit} as any}
        >
          {this.props.controller.error && <Alert title={this.props.controller.error} type="error" />}
          <Form.Item label="Floor area (m2)" required={true}>
            <InputNumber
              defaultValue={this.props.controller.apartmentInfo.floorArea}
              value={this.props.controller.apartmentInfo.floorArea}
              onChange={(value: any) => this.props.controller.apartmentInfo.floorArea = value}
            />
          </Form.Item>
          <Form.Item label="Price per month (USD)" required={true}>
            <InputNumber
              defaultValue={this.props.controller.apartmentInfo.pricePerMonth}
              value={this.props.controller.apartmentInfo.pricePerMonth}
              onChange={(value: any) => this.props.controller.apartmentInfo.pricePerMonth = value}
            />
          </Form.Item>
          <Form.Item label="Number of rooms" required={true}>
            <InputNumber
              defaultValue={this.props.controller.apartmentInfo.numberOfRooms}
              value={this.props.controller.apartmentInfo.numberOfRooms}
              onChange={(value: any) => this.props.controller.apartmentInfo.numberOfRooms = value}
            />
          </Form.Item>
          <Form.Item label="Latitude" required={true}>
            <InputNumber
              defaultValue={this.props.controller.apartmentInfo.coordinates.latitude}
              value={this.props.controller.apartmentInfo.coordinates.latitude}
              onChange={(value: any) => this.props.controller.apartmentInfo.coordinates.latitude = value}
            />
          </Form.Item>
          <Form.Item label="Longitude" required={true}>
            <InputNumber
              defaultValue={this.props.controller.apartmentInfo.coordinates.longitude}
              value={this.props.controller.apartmentInfo.coordinates.longitude}
              onChange={(value: any) => this.props.controller.apartmentInfo.coordinates.longitude = value}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              label="Rented"
              checked={this.props.controller.apartmentInfo.rented}
              onChange={(value: any) => this.props.controller.apartmentInfo.rented = value}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit">Create</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.submit();
    e.preventDefault();
  }
}
