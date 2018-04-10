import { ApartmentDetails, ApartmentInfo } from "@/api";
import { User } from "@/db/entities/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import uuid from "uuid";

@Entity()
export class Apartment {
  public static create(props: ApartmentInfo, realtorId: string): Apartment {
    const apartment = new Apartment();
    apartment.apartmentId = uuid.v4();
    apartment.realtor = new User(realtorId);
    apartment.floorArea = props.floorArea;
    apartment.pricePerMonth = props.pricePerMonth;
    apartment.numberOfRooms = props.numberOfRooms;
    apartment.latitude = props.coordinates.latitude;
    apartment.longitude = props.coordinates.longitude;
    apartment.rented = props.rented;
    apartment.added = new Date();
    return apartment;
  }

  public static toApi(apartment: Apartment): ApartmentDetails {
    return {
      apartmentId: apartment.apartmentId,
      info: {
        floorArea: apartment.floorArea,
        pricePerMonth: apartment.pricePerMonth,
        numberOfRooms: apartment.numberOfRooms,
        coordinates: {
          latitude: apartment.latitude,
          longitude: apartment.longitude,
        },
        rented: apartment.rented,
      },
      realtor: {
        realtorId: apartment.realtor.userId,
        name: apartment.realtor.name,
      },
      dateAdded: Math.round(apartment.added.getTime() / 1000),
    };
  }

  public static fromApi(apartmentDetails: ApartmentDetails): Apartment {
    const apartment = new Apartment();
    apartment.apartmentId = apartmentDetails.apartmentId;
    apartment.realtor = new User(apartmentDetails.realtor.realtorId);
    apartment.added = new Date(apartmentDetails.dateAdded * 1000);
    this.updateInfo(apartment, apartmentDetails.info);
    return apartment;
  }

  public static updateInfo(apartment: Apartment, apartmentInfo: ApartmentInfo) {
    apartment.floorArea = apartmentInfo.floorArea;
    apartment.pricePerMonth = apartmentInfo.pricePerMonth;
    apartment.numberOfRooms = apartmentInfo.numberOfRooms;
    apartment.latitude = apartmentInfo.coordinates.latitude;
    apartment.longitude = apartmentInfo.coordinates.longitude;
    apartment.rented = apartmentInfo.rented;
  }

  @PrimaryColumn("varchar", {
    length: 36,
  })
  public apartmentId!: string;

  @ManyToOne((type) => User, {
    eager: true,
  })
  @JoinColumn({ name: "realtorid" })
  public realtor!: User;

  @Column("real") public floorArea!: number;

  @Column("int") public pricePerMonth!: number;

  @Column("int") public numberOfRooms!: number;

  @Column("real") public latitude!: number;

  @Column("real") public longitude!: number;

  @Column("bool") public rented!: boolean;

  @Column("timestamp without time zone") public added!: Date;
}
