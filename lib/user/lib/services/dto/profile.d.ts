import { ManyToOneType } from '@beyond/odoo';
export interface Profile {
    id: number;
    email: string;
    display_name: string;
    share: boolean;
    groups_id: ManyToOneType;
    employee_id: ManyToOneType;
}
