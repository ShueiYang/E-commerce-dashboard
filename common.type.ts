
export interface StoreParams {
  params: { storeId: string }
}

export interface BillboardParams {
  params: { billboardId: string }
}

export interface CategoryParams {
  params: { 
    categoryId: string 
    storeId: string
  }
}

export interface ThemeParams {
  params: { themeId: string }
}