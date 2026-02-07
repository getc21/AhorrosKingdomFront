import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { ArrowLeft, Edit2, Trash2, Eye, X, MoreVertical, UserPlus } from 'lucide-react';

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for new user
  const [newData, setNewData] = useState({
    name: '',
    phone: '',
    password: '',
    planType: 'Ahorro Campamento 2027',
    role: 'USER'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, depositsRes] = await Promise.all([
        api.get('/users'),
        api.get('/deposits'),
      ]);
      setUsers(usersRes.data.data || []);
      setDeposits(depositsRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/auth/register', newData);
      setShowAddModal(false);
      setNewData({
        name: '',
        phone: '',
        password: '',
        planType: 'Ahorro Campamento 2027',
        role: 'USER'
      });
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, planType: user.planType, isActive: user.isActive });
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (userId) => {
    try {
      setSubmitting(true);
      await api.put(`/users/${userId}`, editData);
      setEditingId(null);
      await fetchUsers();
    } catch (err) {
      setError('Error al actualizar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setOpenMenuId(null);
      await fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  const getUserTotalSavings = (userId) => {
    return deposits
      .filter(d => {
        const depUserId = typeof d.userId === 'object' ? d.userId._id : d.userId;
        return depUserId === userId;
      })
      .reduce((sum, d) => sum + (d.amount || 0), 0);
  };

  const getUserDeposits = (userId) => {
    return deposits
      .filter(d => {
        const depUserId = typeof d.userId === 'object' ? d.userId._id : d.userId;
        return depUserId === userId;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const handleViewDeposits = (user) => {
    setSelectedUser(user);
    setShowDepositModal(true);
    setOpenMenuId(null);
  };

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.phone && user.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Botón atrás versión desktop */}
        <button
          onClick={() => router.push('/dashboard')}
          className="hidden md:flex items-center space-x-2 text-primary hover:text-blue-800 mb-8"
          title="Volver al Dashboard"
        >
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Botón atrás versión mobile (a la izquierda) */}
            <button
              onClick={() => router.push('/dashboard')}
              className="md:hidden text-primary hover:text-blue-800 flex-shrink-0"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">👥 Gestionar Usuarios</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <UserPlus size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {filteredUsers.length > 0 ? (
          <div className="card">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-max text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Nombre</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Teléfono</th>
                    <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Plan</th>
                    <th className="hidden md:table-cell text-right py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Ahorrado (Bs.)</th>
                    <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Rol</th>
                    <th className="hidden sm:table-cell text-center py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Estado</th>
                    <th className="text-center py-2 sm:py-3 px-3 sm:px-4 font-semibold text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      {editingId === user._id ? (
                        <>
                          <td className="py-2 sm:py-4 px-3 sm:px-4">
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-2 sm:py-4 px-3 sm:px-4 text-text-secondary text-sm">{user.phone}</td>
                          <td className="hidden sm:table-cell py-2 sm:py-4 px-3 sm:px-4">
                            <select
                              value={editData.planType}
                              onChange={(e) => setEditData({ ...editData, planType: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="Ahorro Campamento 2027">Ahorro Campamento 2027</option>
                              <option value="Ahorro Otras Actividades">Ahorro Otras Actividades</option>
                            </select>
                          </td>
                          <td className="hidden md:table-cell py-2 sm:py-4 px-3 sm:px-4 text-right font-medium">
                            <span className="text-secondary text-sm">Bs. {getUserTotalSavings(user._id).toFixed(2)}</span>
                          </td>
                          <td className="hidden lg:table-cell py-2 sm:py-4 px-3 sm:px-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell py-2 sm:py-4 px-3 sm:px-4 text-center">
                            <select
                              value={editData.isActive}
                              onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="true">Activo</option>
                              <option value="false">Inactivo</option>
                            </select>
                          </td>
                          <td className="py-2 sm:py-4 px-3 sm:px-4 text-center space-x-1">
                            <button
                              onClick={() => handleSaveEdit(user._id)}
                              disabled={submitting}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                              Cancelar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 sm:py-4 px-3 sm:px-4 font-medium text-text-primary text-sm sm:text-base">{user.name}</td>
                          <td className="py-2 sm:py-4 px-3 sm:px-4 text-text-secondary text-sm sm:text-base">{user.phone}</td>
                          <td className="hidden sm:table-cell py-2 sm:py-4 px-3 sm:px-4 text-text-secondary text-sm">{user.planType}</td>
                          <td className="hidden md:table-cell py-2 sm:py-4 px-3 sm:px-4 text-right font-medium">
                            <span className="text-secondary text-sm">Bs. {getUserTotalSavings(user._id).toFixed(2)}</span>
                          </td>
                          <td className="hidden lg:table-cell py-2 sm:py-4 px-3 sm:px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell py-2 sm:py-4 px-3 sm:px-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 px-3 sm:px-4 text-center relative">
                            <div className="flex justify-center">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                                className="p-2 hover:bg-gray-200 rounded-full"
                              >
                                <MoreVertical size={18} />
                              </button>
                              
                              {/* Menú desplegable */}
                              {openMenuId === user._id && (
                                <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => handleViewDeposits(user)}
                                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-green-700 flex items-center"
                                  >
                                    <Eye size={14} className="mr-2" />
                                    Ver Depósitos
                                  </button>
                                  <button
                                    onClick={() => handleEdit(user)}
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 flex items-center border-t border-gray-200"
                                  >
                                    <Edit2 size={14} className="mr-2" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user._id)}
                                    className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center border-t border-gray-200"
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-text-secondary text-lg">No hay usuarios registrados</p>
          </div>
        )}

        {/* Modal para Agregar Usuario */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-primary text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Registrar Usuario</h2>
                <button onClick={() => setShowAddModal(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newData.name}
                    onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    required
                    value={newData.phone}
                    onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                    placeholder="Ej. 71234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clave de Acceso</label>
                  <input
                    type="text"
                    style={{ WebkitTextSecurity: 'disc' }}
                    required
                    autoComplete="off"
                    value={newData.password}
                    onChange={(e) => setNewData({ ...newData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan de Ahorro</label>
                  <select
                    value={newData.planType}
                    onChange={(e) => setNewData({ ...newData, planType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                  >
                    <option value="Ahorro Campamento 2027">Ahorro Campamento 2027</option>
                    <option value="Ahorro Otras Actividades">Ahorro Otras Actividades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Usuario</label>
                  <select
                    value={newData.role}
                    onChange={(e) => setNewData({ ...newData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                  >
                    <option value="USER">Usuario (Participante)</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateUser}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 shadow-md"
                  >
                    {submitting ? 'Registrando...' : 'Registrar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Depósitos */}
        {showDepositModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-primary text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Depósitos de {selectedUser.name}</h2>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="hover:bg-blue-700 p-2 rounded"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {getUserDeposits(selectedUser._id).length > 0 ? (
                  <>
                    <table className="w-full mb-6">
                      <thead>
                        <tr className="border-b-2 border-primary">
                          <th className="text-left py-3 px-4 font-bold text-primary">Fecha</th>
                          <th className="text-right py-3 px-4 font-bold text-primary">Monto (Bs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getUserDeposits(selectedUser._id).map((deposit) => (
                          <tr key={deposit._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {new Date(deposit.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              Bs. {deposit.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-secondary bg-opacity-10 border-l-4 border-secondary p-4 rounded">
                      <p className="text-text-secondary text-sm mb-1">Total ahorrado hasta la fecha:</p>
                      <p className="text-3xl font-bold text-secondary">
                        Bs. {getUserTotalSavings(selectedUser._id).toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text-secondary text-lg">
                      {selectedUser.name} no tiene depósitos registrados
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 p-6 flex justify-end">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
