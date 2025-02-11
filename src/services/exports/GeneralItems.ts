import { Determinations } from "../forms/Determinations";
import { DefaultItem } from "./exportDetailForUser";

export interface GeneralItems extends DefaultItem {
    items: [{
        contents: string;
        eventVenue: string;
        sponsor: string;
        determinations: Determinations;
    }];
}
