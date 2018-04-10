import {
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
import { ApartmentDetails, Viewport } from "../../api";
import { ListApartmentsViewModel } from "../../viewmodels/authenticated/states/apartments/list";
import { UserPickerViewModel } from "../../viewmodels/components/userpicker";
import "./ListApartments.scss";
import { RealtorPicker} from "./RealtorPicker";

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
export class ListApartments extends React.Component<{
  viewModel: ListApartmentsViewModel,
  enableRentedFilter?: boolean,
  realtorFilter?: UserPickerViewModel,
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
      <div className="ListApartments">
        <div className="filter-panel">
          <Card
            header={
              <h3>
                Filter apartments
              </h3>
            }
          >
            <Form model={this.props.viewModel.filter} {...{onSubmit: this.onSubmit} as any}>
              {this.renderFilter(
                "By floor area",
                "Floor area (m²)",
                0,
                100,
                this.props.viewModel.filter.sizeRange,
                (value) => this.props.viewModel.filter.sizeRange = value,
              )}
              {this.renderFilter(
                "By number of rooms",
                "Number of rooms",
                1,
                20,
                this.props.viewModel.filter.numberOfRooms,
                (value) => this.props.viewModel.filter.numberOfRooms = value,
              )}
              {this.renderFilter(
                "By price",
                "Price range",
                50,
                20000,
                this.props.viewModel.filter.priceRange,
                (value) => this.props.viewModel.filter.priceRange = value,
              )}
              {this.props.enableRentedFilter && this.renderRentedFilter()}
              {this.props.realtorFilter && (
                <div className="filter-section spaced">
                  <RealtorPicker
                    userPicker={this.props.realtorFilter}
                    label="By realtor"
                  />
                </div>
              )}
              <Form.Item>
                <Button type="primary" nativeType="submit">Filter</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Dialog
          visible={!!this.props.viewModel.deletingApartment}
          title="Delete apartment?"
          size="tiny"
          onCancel={() => this.props.viewModel.deletingApartment!.cancel()}
        >
          <Dialog.Body>
            <span>This will permanently delete this apartment listing.</span>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.props.viewModel.deletingApartment!.cancel()}>Cancel</Button>
            <Button type="primary" onClick={() => this.props.viewModel.deletingApartment!.confirm()}>Confirm</Button>
          </Dialog.Footer>
        </Dialog>
        <Card className="list">
          <Loading loading={this.props.viewModel.loading}>
            <Tabs
              activeName={this.props.viewModel.tab.kind}
              onTabClick={(tab) => this.props.viewModel.switchTab(tab.props.name)}
            >
              <Tabs.Pane name="map" label="Map view">
                <MapComponent
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                  }&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div />}
                  containerElement={<div />}
                  mapElement={<div className="map-container" />}
                  apartments={this.props.viewModel.apartments}
                  onViewportChanged={this.props.viewModel.updateViewport}
                />
              </Tabs.Pane>
              <Tabs.Pane name="list" label="List view">
                <Table
                  columns={columns}
                  data={this.props.viewModel.apartments.map(this.formatRow)}
                  stripe={true}
                  {...({emptyText: "No apartments to show."}) as any}
                />
                <div className="pagination">
                  <Pagination
                    layout="prev, pager, next"
                    pageCount={this.props.viewModel.pageCount}
                    currentPage={this.props.viewModel.currentPage}
                    onCurrentChange={(page) => {
                      this.props.viewModel.loadPage(page!);
                    }}
                  />
                </div>
              </Tabs.Pane>
            </Tabs>
          </Loading>
        </Card>
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
      <div className="filter-section">
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
          <Card
            header={<h4>
              {header}
            </h4>}
          >
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
          </Card>
        }
      </div>
    );
  }

  private renderRentedFilter() {
    const filter = this.props.viewModel.filter;
    const currentValue = (filter.rented === null) ? "show-all" : filter.rented ? "only-rented" : "only-rentable";
    return (
      <div className="filter-section spaced">
        <Form.Item label="By status">
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
            <Select.Option label="Show all apartments" value="show-all" />
            <Select.Option label="Show only rented apartments" value="only-rented" />
            <Select.Option label="Show only rentable apartments" value="only-rentable" />
          </Select>
        </Form.Item>
      </div>
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
    this.props.viewModel.loadFresh();
    e.preventDefault();
  }
}

const MapComponent = withScriptjs(withGoogleMap((props: {
  apartments: ApartmentDetails[],
  onViewportChanged(viewport: Viewport),
}) => {
  let map: GoogleMap | null;
  return (
    <GoogleMap
      ref={(m) => {
        map = m;
      }}
      defaultZoom={3}
      defaultCenter={{ lat: -33.8688, lng: 151.2093 }}
      onIdle={() => {
        if (map) {
          const bounds = map.getBounds();
          if (!bounds) {
            // Do nothing.
            return;
          }
          const viewport: Viewport = {
            southWest: {
              latitude: bounds.getSouthWest().lat(),
              longitude: bounds.getSouthWest().lng(),
            },
            northEast: {
              latitude: bounds.getNorthEast().lat(),
              longitude: bounds.getNorthEast().lng(),
            },
          };
          props.onViewportChanged(viewport);
        }
      }}
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
  );
}));
