import {
  Alert,
  Button,
  Card,
  Form,
  Loading,
  Pagination,
  Select,
  Table,
} from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { Role, UserDetails } from "../../api";
import { AdminListingUsers } from "../../state/authenticated/states/users/admin-listing";
import "./AdminListingUsersComponent.scss";

interface Row {
  details: UserDetails;
  userId: string;
  name: string;
  role: string;
  email: string;
}

@observer
export class AdminListingUsersComponent extends React.Component<{
  controller: AdminListingUsers,
}> {
  public render() {
    const columns = [
      {
        label: "Name",
        prop: "name",
        align: "center",
      },
      {
        label: "Role",
        prop: "role",
        align: "center",
      },
      {
        label: "Email",
        prop: "email",
        align: "center",
      },
      {
        label: "Operations",
        align: "center",
        fixed: "right",
        render: (row: Row) => {
          return (
            <>
              <Button
                type="text"
                size="small"
                onClick={() => this.props.controller.editUser(row.details)}
              >
                Edit
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => this.props.controller.deleteUser(row.details)}
              >
                Delete
              </Button>
            </>
          );
        },
      },
    ];
    return (
      <div className="AdminListingUsersComponent">
        <div className="filter-panel">
          <Card>
            <Form model={this.props.controller.filter} {...{onSubmit: this.onSubmit} as any}>
              {this.renderRoleFilter()}
              <Form.Item>
                <Button type="primary" nativeType="submit">Filter</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Loading className="list" loading={this.props.controller.loading}>
          {this.props.controller.total > 0 && <>
            <Alert
              title={`We found ${this.props.controller.total} user${this.props.controller.total !== 1 ? "s" : ""}.`}
              closable={false}
            />
            <br />
          </>}
          <Table
            columns={columns}
            data={this.props.controller.users.map(this.formatRow)}
            stripe={true}
            {...({emptyText: "No users to show."}) as any}
          />
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

  private renderRoleFilter() {
    const filter = this.props.controller.filter;
    const currentValue = (filter.role === null) ? "show-all" : filter.role;
    return (
      <Form.Item label="Filter by role">
        <Select
          value={currentValue}
          onChange={(value) => {
            switch (value) {
              case "show-all":
                filter.role = null;
                break;
              default:
                filter.role = value as Role;
            }
          }}
        >
          <Select.Option key="show-all" label="Show all users" value="show-all" />
          <Select.Option key="client" label="Show only clients" value="client" />
          <Select.Option key="realtor" label="Show only realtors" value="realtor" />
          <Select.Option key="admin" label="Show only admins" value="admin" />
        </Select>
      </Form.Item>
    );
  }

  private formatRow = (user: UserDetails): Row => {
    return {
      details: user,
      userId: user.userId,
      name: user.name,
      role: this.formatRole(user.role),
      email: user.email,
    };
  }

  private formatRole(role: Role) {
    switch (role) {
      case "client":
        return "Client";
      case "realtor":
        return "Realtor";
      case "admin":
        return "Admin";
      default:
        return "?";
    }
  }

  private onSubmit = (e: Event) => {
    this.props.controller.loadFresh();
    e.preventDefault();
  }
}
