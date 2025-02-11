import { Determinations } from "../forms/Determinations";
import { DefaultItem } from "./exportDetailForUser";

export interface OtherItems extends DefaultItem {
    items: [{
        name: string;
        standarNumber: number;
        determinations: Determinations;
    }]
    totalStandarNumber: number;
}