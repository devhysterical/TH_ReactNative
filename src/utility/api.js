// Hàm fetch danh sách contacts ban đầu
export const fetchContacts = async () => {
  try {
    const response = await fetch(
      'https://randomuser.me/api/?results=100&seed=fullstackio',
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const {results} = await response.json();
    // Ánh xạ dữ liệu trả về sang cấu trúc mong muốn
    return results.map(contact => ({
      id: contact.login.uuid, // Sử dụng uuid làm id duy nhất
      name: `${contact.name.first} ${contact.name.last}`,
      avatar: contact.picture.large,
      phone: contact.phone,
      cell: contact.cell,
      email: contact.email,
      favorite: Math.random() < 0.1, // Tạm thời gán ngẫu nhiên favorite
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

