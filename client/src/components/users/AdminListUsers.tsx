import {
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
import { humanizeRole } from "../../i18n/role";
import { AdminListUsersViewModel } from "../../viewmodels/authenticated/states/users/admin-list";
import "./AdminListUsers.scss";

interface Row {
  details: UserDetails;
  userId: string;
  name: string;
  role: string;
  email: string;
}

@observer
export class AdminListUsers extends React.Component<{
  viewModel: AdminListUsersViewModel,
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
                onClick={() => this.props.viewModel.editUser(row.details)}
              >
                Edit
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => this.props.viewModel.deleteUser(row.details)}
              >
                Delete
              </Button>
            </>
          );
        },
      },
    ];
    return (
      <div className="AdminListUsers">
        <div className="filter-panel">
          <Card
              header={
                <h3>
                  Filter users
                </h3>
              }
          >
            <Form model={this.props.viewModel.filter} {...{onSubmit: this.onSubmit} as any}>
              {this.renderRoleFilter()}
              <Form.Item>
                <Button type="primary" nativeType="submit">Filter</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Card className="list">
          <Loading loading={this.props.viewModel.loading}>
            <Table
              columns={columns}
              data={this.props.viewModel.users.map(this.formatRow)}
              stripe={true}
              {...({emptyText: "No users to show."}) as any}
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
          </Loading>
        </Card>
      </div>
    );
  }

  private renderRoleFilter() {
    const filter = this.props.viewModel.filter;
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
          <Select.Option label="Show all users" value="show-all" />
          <Select.Option label="Show only clients" value="client" />
          <Select.Option label="Show only realtors" value="realtor" />
          <Select.Option label="Show only admins" value="admin" />
        </Select>
      </Form.Item>
    );
  }

  private formatRow = (user: UserDetails): Row => {
    return {
      details: user,
      userId: user.userId,
      name: user.name,
      role: humanizeRole(user.role),
      email: user.email,
    };
  }

  private onSubmit = (e: Event) => {
    this.props.viewModel.loadFresh();
    e.preventDefault();
  }
}
