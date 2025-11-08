import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const CoverLettersPage = () => {
  const [letters, setLetters] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    position: '',
    content: ''
  });

  const handleCreate = () => {
    setEditingLetter(null);
    setFormData({ title: '', company: '', position: '', content: '' });
    setShowModal(true);
  };

  const handleEdit = (letter) => {
    setEditingLetter(letter);
    setFormData({
      title: letter.title,
      company: letter.company,
      position: letter.position,
      content: letter.content
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editingLetter) {
      setLetters(letters.map(l => 
        l.id === editingLetter.id 
          ? { ...l, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      ));
      toast.success('Đã cập nhật cover letter');
    } else {
      const newLetter = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        wordCount: formData.content.split(/\s+/).length,
        usedCount: 0
      };
      setLetters([newLetter, ...letters]);
      toast.success('Đã tạo cover letter mới');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cover letter này?')) {
      setLetters(letters.filter(l => l.id !== id));
      toast.success('Đã xóa cover letter');
    }
  };

  const handleDuplicate = (letter) => {
    const duplicated = {
      ...letter,
      id: Date.now().toString(),
      title: `${letter.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usedCount: 0
    };
    setLetters([duplicated, ...letters]);
    toast.success('Đã sao chép cover letter');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cover Letter của tôi
              </h1>
              <p className="text-gray-600 mt-1">Quản lý {letters.length} thư xin việc</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            Tạo mới
          </button>
        </div>

        {/* Letters Grid */}
        {letters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-full">
                <DocumentTextIcon className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có Cover Letter nào</h3>
            <p className="text-gray-600 mb-6">Hãy tạo cover letter đầu tiên để gây ấn tượng với nhà tuyển dụng</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Tạo Cover Letter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {letters.map((letter) => (
              <div 
                key={letter.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{letter.title}</h3>
                  {letter.company && (
                    <p className="text-sm text-blue-100 mt-1">{letter.company}</p>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {letter.position && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      📋 {letter.position}
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {letter.content}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{letter.wordCount}</div>
                      <div className="text-xs text-gray-600">từ</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">{letter.usedCount}</div>
                      <div className="text-xs text-gray-600">lần dùng</div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Tạo: {formatDate(letter.createdAt)}
                    </span>
                    <span>•</span>
                    <span>Sửa: {formatDate(letter.updatedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleEdit(letter)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-5 w-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(letter)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Sao chép"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5 mx-auto" />
                    </button>
                    <button
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Xem trước"
                    >
                      <EyeIcon className="h-5 w-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Xóa"
                    >
                      <TrashIcon className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">
                  {editingLetter ? 'Chỉnh sửa Cover Letter' : 'Tạo Cover Letter mới'}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Cover Letter - Frontend Developer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Công ty
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tên công ty"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Vị trí
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Vị trí ứng tuyển"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Viết nội dung cover letter của bạn tại đây..."
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {formData.content.split(/\s+/).filter(w => w).length} từ
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingLetter ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLettersPage;
