import { Button, Card, Checkbox, Form, InputNumber, Loading, Table } from "element-react";
import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { ApartmentDetails } from "../../api";
import { ListingApartments } from "../../state/authenticated/states/apartments/listing";
import "./ListingApartmentsComponent.scss";

@observer
export class ListingApartmentsComponent extends React.Component<{controller: ListingApartments}> {
  public render() {
    // HACK: onSubmit is missing from the FormProps type.
    const onSubmit: any = {
      onSubmit: this.onSubmit,
    };
    return (
      <div className="ListingApartmentsComponent">
        <div className="filter-panel">
          <Card>
            <Form model={this.props.controller.filter} {...onSubmit}>
              <Form.Item label="Filter by floor area">
                <Checkbox
                  checked={!!this.props.controller.filter.sizeRange}
                  onChange={(checked: boolean) => {
                    if (checked) {
                      this.props.controller.filter.sizeRange = {
                        min: 0,
                        max: 100,
                      };
                    } else {
                      this.props.controller.filter.sizeRange = null;
                    }
                  }}
                />
              </Form.Item>
              {this.props.controller.filter.sizeRange &&
                <>
                  <h3>Floor area (m²)</h3>
                  <Form.Item label="Min">
                    <InputNumber
                      defaultValue={0}
                      value={this.props.controller.filter.sizeRange.min}
                      onChange={(value: any) => {
                        this.props.controller.filter.sizeRange!.min = value;
                      }}
                      min={0}
                      size="small"
                    />
                  </Form.Item>
                  <Form.Item label="Max">
                    <InputNumber
                      defaultValue={100}
                      value={this.props.controller.filter.sizeRange.max}
                      onChange={(value: any) => {
                        this.props.controller.filter.sizeRange!.max = value;
                      }}
                      min={this.props.controller.filter.sizeRange.min}
                      size="small"
                    />
                  </Form.Item>
                </>
              }
              <Form.Item>
                <Button type="primary" nativeType="submit">Filter</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Loading className="list" loading={this.props.controller.loading}>
          <Table
            columns={COLUMNS}
            data={this.props.controller.apartments.map(formatRow)}
            stripe={true}
            {...({emptyText: "No apartments to show."}) as any}
          />
        </Loading>
      </div>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.loadFresh();
    e.preventDefault();
  }
}

const COLUMNS = [
  {
    label: "Realtor",
    prop: "realtor",
    align: "center",
  },
  {
    label: "Floor area (m²)",
    prop: "floorArea",
    align: "center",
  },
  {
    label: "Added",
    prop: "dateAdded",
    align: "center",
  },
];

function formatRow(apartment: ApartmentDetails) {
  return {
    realtor: apartment.realtor.name,
    floorArea: apartment.info.floorArea,
    dateAdded: moment(apartment.dateAdded * 1000).fromNow(),
  };
}
