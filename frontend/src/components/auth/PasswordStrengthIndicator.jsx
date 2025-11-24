import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState('');
  const [color, setColor] = useState('');
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSpace: true,
    noSequential: true,
    noRepeat: true
  });

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLevel('');
      return;
    }

    let score = 0;
    const newChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noSpace: !/\s/.test(password),
      noSequential: !hasSequential(password),
      noRepeat: !/(.)\1{2,}/.test(password)
    };

    setChecks(newChecks);

    // Tính điểm
    if (newChecks.length) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (newChecks.lowercase) score += 10;
    if (newChecks.uppercase) score += 10;
    if (newChecks.number) score += 10;
    if (newChecks.special) score += 15;

    const specialChars = password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
    if (specialChars && specialChars.length >= 2) score += 10;

    if (newChecks.lowercase && newChecks.uppercase && newChecks.number && newChecks.special) {
      score += 5;
    }

    setStrength(score);

    // Xác định level và màu
    if (score >= 80) {
      setLevel('Rất mạnh');
      setColor('bg-green-500');
    } else if (score >= 60) {
      setLevel('Mạnh');
      setColor('bg-blue-500');
    } else if (score >= 40) {
      setLevel('Trung bình');
      setColor('bg-yellow-500');
    } else {
      setLevel('Yếu');
      setColor('bg-red-500');
    }
  }, [password]);

  const hasSequential = (str) => {
    const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    for (let seq of sequences) {
      for (let i = 0; i < seq.length - 2; i++) {
        if (str.includes(seq.substring(i, i + 3))) {
          return true;
        }
      }
    }
    return false;
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>

      {/* Strength level */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Độ mạnh mật khẩu:</span>
        <span className={`font-semibold ${
          level === 'Rất mạnh' ? 'text-green-600' :
          level === 'Mạnh' ? 'text-blue-600' :
          level === 'Trung bình' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {level} ({strength}%)
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="text-xs space-y-1 mt-3">
        <p className="font-semibold text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
        
        <div className={`flex items-center ${checks.length ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="mr-2">{checks.length ? '✓' : '○'}</span>
          <span>Ít nhất 8 ký tự</span>
        </div>

        <div className={`flex items-center ${checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="mr-2">{checks.uppercase ? '✓' : '○'}</span>
          <span>Có chữ cái viết hoa (A-Z)</span>
        </div>

        <div className={`flex items-center ${checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="mr-2">{checks.lowercase ? '✓' : '○'}</span>
          <span>Có chữ cái viết thường (a-z)</span>
        </div>

        <div className={`flex items-center ${checks.number ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="mr-2">{checks.number ? '✓' : '○'}</span>
          <span>Có chữ số (0-9)</span>
        </div>

        <div className={`flex items-center ${checks.special ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="mr-2">{checks.special ? '✓' : '○'}</span>
          <span>Có ký tự đặc biệt (!@#$%...)</span>
        </div>

        <div className={`flex items-center ${checks.noSpace ? 'text-green-600' : 'text-red-500'}`}>
          <span className="mr-2">{checks.noSpace ? '✓' : '✗'}</span>
          <span>Không chứa khoảng trắng</span>
        </div>

        <div className={`flex items-center ${checks.noRepeat ? 'text-green-600' : 'text-red-500'}`}>
          <span className="mr-2">{checks.noRepeat ? '✓' : '✗'}</span>
          <span>Không có ký tự lặp lại (aaa, 111)</span>
        </div>

        <div className={`flex items-center ${checks.noSequential ? 'text-green-600' : 'text-red-500'}`}>
          <span className="mr-2">{checks.noSequential ? '✓' : '✗'}</span>
          <span>Không có chuỗi tuần tự (abc, 123)</span>
        </div>
      </div>

      {/* Tips */}
      {strength < 60 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <p className="font-semibold mb-1">💡 Gợi ý:</p>
          <ul className="list-disc list-inside space-y-1">
            {!checks.length && <li>Tăng độ dài mật khẩu lên ít nhất 8 ký tự</li>}
            {!checks.uppercase && <li>Thêm chữ cái viết hoa</li>}
            {!checks.lowercase && <li>Thêm chữ cái viết thường</li>}
            {!checks.number && <li>Thêm chữ số</li>}
            {!checks.special && <li>Thêm ký tự đặc biệt (!@#$%...)</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

PasswordStrengthIndicator.propTypes = {
  password: PropTypes.string.isRequired
};

export default PasswordStrengthIndicator;
