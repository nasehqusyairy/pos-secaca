export type SalesByDateProps = {
    start_at?: Date;
    end_at?: Date;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
};

export type AnnualSalesProps = {
    first_year: number;
    second_year: number;
    locs?: number[];
    select_all_location?: boolean;
    exclude_locs?: number[];
};