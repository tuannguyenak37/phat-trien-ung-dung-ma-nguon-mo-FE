export interface tagPopular{
    name : string;
    tag_id : string;

}
export interface categoriesPopular {
    name : string;
    description: string;
    slug : string;
    category_id :  string;
}

export interface tagPopularList {
   list: [tagPopular];
}
export interface categoriesPopularList  {
   list: [categoriesPopular];
}