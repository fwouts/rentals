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
              {this.renderFilter(
                "Filter by floor area",
                "Floor area (m²)",
                0,
                100,
                this.props.controller.filter.sizeRange,
                (value) => this.props.controller.filter.sizeRange = value,
              )}
              {this.renderFilter(
                "Filter by number of rooms",
                "Number of rooms",
                1,
                20,
                this.props.controller.filter.numberOfRooms,
                (value) => this.props.controller.filter.numberOfRooms = value,
              )}
              {this.renderFilter(
                "Filter by price",
                "Price range",
                50,
                20000,
                this.props.controller.filter.priceRange,
                (value) => this.props.controller.filter.priceRange = value,
              )}
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

  private renderFilter(
    toggleLabel: string,
    header: string,
    min: number,
    max: number,
    field: {min: number, max: number} | null,
    setField: (value: {min: number, max: number} | null) => void,
  ) {
    return (
      <>
        <Form.Item>
          <Checkbox
            checked={!!field}
            onChange={(checked: boolean) => {
              if (checked) {
                setField({
                  min,
                  max,
                });
              } else {
                setField(null);
              }
            }}
          >
            {toggleLabel}
          </Checkbox>
        </Form.Item>
        {field &&
          <>
            <h3>{header}</h3>
            <Form.Item label="Min">
              <InputNumber
                defaultValue={min}
                value={field.min}
                onChange={(value: any) => {
                  field!.min = value;
                }}
                min={min}
                size="small"
              />
            </Form.Item>
            <Form.Item label="Max">
              <InputNumber
                defaultValue={max}
                value={field.max}
                onChange={(value: any) => {
                  field!.max = value;
                }}
                min={field.min}
                size="small"
              />
            </Form.Item>
          </>
        }
      </>
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
    label: "Rooms",
    prop: "numberOfRooms",
    align: "center",
  },
  {
    label: "Floor area (m²)",
    prop: "floorArea",
    align: "center",
  },
  {
    label: "Price per month (USD)",
    prop: "pricePerMonth",
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
    numberOfRooms: apartment.info.numberOfRooms,
    pricePerMonth: apartment.info.pricePerMonth,
    dateAdded: moment(apartment.dateAdded * 1000).fromNow(),
  };
}
