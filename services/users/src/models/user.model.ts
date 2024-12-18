import { Address, Company, User } from "../types";
import { ValidationError } from "@sweetch/shared";

export class UserModel {
    id: number;
    name: string;
    username: string;
    email: string;
    address?: Address;
    phone: string;
    website: string;
    company?: Company;

    constructor(user: User) {
        // Validate the input object before the assignment
        if (!UserModel.isValidUser(user)) {
            throw new ValidationError("Invalid user data", user);
        }

        this.id = user.id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.address = user.address;
        this.phone = user.phone;
        this.website = user.website;
        this.company = user.company;
    }

    static isValidUser(user: any): user is User {
        return (
            typeof user.id === "number" &&
            typeof user.name === "string" &&
            typeof user.username === "string" &&
            typeof user.email === "string" &&
            (user.address === undefined || UserModel.isValidAddress(user.address)) &&
            typeof user.phone === "string" &&
            typeof user.website === "string" &&
            (user.company === undefined || UserModel.isValidCompany(user.company))
        );
    }

    private static isValidAddress(address: any): address is Address {
        return (
            typeof address.street === "string" &&
            typeof address.suite === "string" &&
            typeof address.city === "string" &&
            typeof address.zipcode === "string" &&
            (address.geo === undefined || (typeof address.geo.lat === "string" && typeof address.geo.lng === "string"))
        );
    }

    private static isValidCompany(company: any): company is Company {
        return (
            typeof company.name === "string" &&
            typeof company.catchPhrase === "string" &&
            typeof company.bs === "string"
        );
    }
}
