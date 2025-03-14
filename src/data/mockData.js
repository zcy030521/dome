// 模拟商品数据
export const mockGoods = [
  {
    _id: "1",
    text: "iPhone 13 Pro",
    img: "https://via.placeholder.com/300x300?text=iPhone+13",
    price: 6999,
    num: 10,
    cate: "电子产品",
    description: "Apple iPhone 13 Pro 256GB 石墨色 5G手机"
  },
  {
    _id: "2",
    text: "MacBook Pro",
    img: "https://via.placeholder.com/300x300?text=MacBook",
    price: 12999,
    num: 5,
    cate: "电子产品",
    description: "Apple MacBook Pro 14英寸 M1 Pro芯片 16GB 512GB SSD"
  },
  {
    _id: "3",
    text: "AirPods Pro",
    img: "https://via.placeholder.com/300x300?text=AirPods",
    price: 1999,
    num: 20,
    cate: "配件",
    description: "Apple AirPods Pro 主动降噪无线蓝牙耳机"
  },
  {
    _id: "4",
    text: "iPad Air",
    img: "https://via.placeholder.com/300x300?text=iPad",
    price: 4799,
    num: 8,
    cate: "电子产品",
    description: "Apple iPad Air 10.9英寸 Wi-Fi版 64GB"
  },
  {
    _id: "5",
    text: "Apple Watch Series 7",
    img: "https://via.placeholder.com/300x300?text=Watch",
    price: 3199,
    num: 15,
    cate: "配件",
    description: "Apple Watch Series 7 GPS款 45毫米 午夜色铝金属表壳"
  }
];

// 根据ID获取商品
export const getGoodById = (id) => {
  return mockGoods.find(item => item._id === id) || null;
}; 