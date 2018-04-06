import {
  Alert,
  Button,
  Card,
  Checkbox,
  Dialog,
  Form,
  InputNumber,
  Loading,
  Pagination,
  Select,
  Table,
  Tabs,
} from "element-react";
import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import { ApartmentDetails } from "../../api";
import { ListingApartments } from "../../state/authenticated/states/apartments/listing";
import { UserPicker } from "../../state/components/userpicker";
import "./ListingApartmentsComponent.scss";
import { RealtorPickerComponent } from "./RealtorPickerComponent";

interface Row {
  details: ApartmentDetails;
  apartmentId: string;
  realtorName: string;
  floorArea: number;
  numberOfRooms: number;
  pricePerMonth: number;
  rented: "Rented" | "Rentable";
  dateAdded: string;
  editable: boolean;
}

@observer
export class ListingApartmentsComponent extends React.Component<{
  controller: ListingApartments,
  enableRentedFilter?: boolean,
  realtorFilter?: UserPicker,
  enableModification?: {
    filter: {
      realtorId: string,
    } | "all",
    editApartment(apartmentDetails: ApartmentDetails);
    deleteApartment(apartmentDetails: ApartmentDetails);
  },
}> {
  public render() {
    const columns = [
      {
        label: "Realtor",
        prop: "realtorName",
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
      ...(this.props.enableRentedFilter ? [
        {
          label: "Status",
          prop: "rented",
          align: "center",
        },
      ] : []),
      {
        label: "Added",
        prop: "dateAdded",
        align: "center",
      },
      ...(this.props.enableModification ? [
        {
          label: "Operations",
          align: "center",
          fixed: "right",
          render: (row: Row) => {
            return this.props.enableModification && row.editable && (
              <>
                <Button
                  type="text"
                  size="small"
                  onClick={() => this.props.enableModification!.editApartment(row.details)}
                >
                  Edit
                </Button>
                <Button
                  type="text"
                  size="small"
                  onClick={() => this.props.enableModification!.deleteApartment(row.details)}
                >
                  Delete
                </Button>
              </>
            );
          },
        },
      ] : []),
    ];
    return (
      <div className="ListingApartmentsComponent">
        <div className="filter-panel">
          <Card>
            <Form model={this.props.controller.filter} {...{onSubmit: this.onSubmit} as any}>
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
              {this.props.enableRentedFilter && this.renderRentedFilter()}
              {this.props.realtorFilter && <RealtorPickerComponent userPicker={this.props.realtorFilter} />}
              <Form.Item>
                <Button type="primary" nativeType="submit">Filter</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Dialog
          visible={!!this.props.controller.deletingApartment}
          title="Delete apartment?"
          size="tiny"
          onCancel={() => this.props.controller.deletingApartment!.cancel()}
        >
          <Dialog.Body>
            <span>This will permanently delete this apartment listing.</span>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.props.controller.deletingApartment!.cancel()}>Cancel</Button>
            <Button type="primary" onClick={() => this.props.controller.deletingApartment!.confirm()}>Confirm</Button>
          </Dialog.Footer>
        </Dialog>
        <Loading className="list" loading={this.props.controller.loading}>
          {this.props.controller.total > 0 && <>
            <Alert
              title={`We found ${this.props.controller.total} result${this.props.controller.total !== 1 ? "s" : ""}.`}
              closable={false}
            />
            <br />
          </>}
          <Tabs
            activeName={this.props.controller.tab}
            onTabClick={(tab) => this.props.controller.tab = tab.props.name}
          >
            <Tabs.Pane name="map" label="Map view">
              <MapComponent
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                  process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                }&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div />}
                containerElement={<div />}
                mapElement={<div className="map-container" />}
                apartments={this.props.controller.apartments}
              />
            </Tabs.Pane>
            <Tabs.Pane name="list" label="List view">
              <Table
                columns={columns}
                data={this.props.controller.apartments.map(this.formatRow)}
                stripe={true}
                {...({emptyText: "No apartments to show."}) as any}
              />
            </Tabs.Pane>
          </Tabs>
          <div className="pagination">
            <Pagination
              layout="prev, pager, next"
              pageCount={this.props.controller.pageCount}
              currentPage={this.props.controller.currentPage}
              onCurrentChange={(page) => {
                this.props.controller.loadPage(page!);
              }}
            />
          </div>
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

  private renderRentedFilter() {
    const filter = this.props.controller.filter;
    const currentValue = (filter.rented === null) ? "show-all" : filter.rented ? "only-rented" : "only-rentable";
    return (
      <Form.Item label="Filter by status">
        <Select
          value={currentValue}
          onChange={(value) => {
            switch (value) {
              case "show-all":
                filter.rented = null;
                break;
              case "only-rented":
                filter.rented = true;
                break;
              case "only-rentable":
                filter.rented = false;
                break;
              default:
                throw new Error(`Unknown value: ${value}.`);
            }
          }}
        >
          <Select.Option key="show-all" label="Show all apartments" value="show-all" />
          <Select.Option key="only-rented" label="Show only rented apartments" value="only-rented" />
          <Select.Option key="only-rentable" label="Show only rentable apartments" value="only-rentable" />
        </Select>
      </Form.Item>
    );
  }

  private formatRow = (apartment: ApartmentDetails): Row => {
    return {
      details: apartment,
      apartmentId: apartment.apartmentId,
      realtorName: apartment.realtor.name,
      floorArea: apartment.info.floorArea,
      numberOfRooms: apartment.info.numberOfRooms,
      pricePerMonth: apartment.info.pricePerMonth,
      rented: apartment.info.rented ? "Rented" : "Rentable",
      dateAdded: moment(apartment.dateAdded * 1000).fromNow(),
      editable: this.props.enableModification ? (
        this.props.enableModification.filter === "all" ||
        this.props.enableModification.filter.realtorId === apartment.realtor.realtorId
      ) : false,
    };
  }

  private onSubmit = (e: Event) => {
    this.props.controller.loadFresh();
    e.preventDefault();
  }
}

const MapComponent = withScriptjs(withGoogleMap((props: {
  apartments: ApartmentDetails[],
}) => (
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: -33.8688, lng: 151.2093 }}
  >
    {props.apartments.map((apartment) => (
      <Marker
        key={apartment.apartmentId}
        position={{
          lat: apartment.info.coordinates.latitude,
          lng: apartment.info.coordinates.longitude,
        }}
        title={apartment.realtor.name}
      />
    ))}
  </GoogleMap>
),
));
