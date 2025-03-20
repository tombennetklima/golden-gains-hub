
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuthService, User } from "@/lib/mockAuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Save, X, UserCircle, KeyRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editUserPassword, setEditUserPassword] = useState<{ userId: string, password: string } | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const currentUser = await mockAuthService.getCurrentUser();
      
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      
      setUser(currentUser);
      
      if (currentUser.isAdmin) {
        try {
          const users = await mockAuthService.getAllUsers();
          setAllUsers(users);
          setSearchResults(users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleSearch = async () => {
    if (!user?.isAdmin) return;
    
    setSearchLoading(true);
    try {
      if (searchQuery.trim() === "") {
        setSearchResults(allUsers);
      } else {
        const results = await mockAuthService.searchUsers(searchQuery);
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Fehler",
        description: "Bei der Suche ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser({ ...user });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    
    try {
      await mockAuthService.updateUser(editUser.id, {
        username: editUser.username,
        email: editUser.email,
        isAdmin: editUser.isAdmin,
      });
      
      // Update local data
      const updatedUsers = allUsers.map(u => 
        u.id === editUser.id ? editUser : u
      );
      setAllUsers(updatedUsers);
      setSearchResults(
        searchResults.map(u => u.id === editUser.id ? editUser : u)
      );
      
      toast({
        title: "Benutzer aktualisiert",
        description: `Benutzer ${editUser.username} wurde erfolgreich aktualisiert.`,
      });
      
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Fehler",
        description: "Der Benutzer konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = (userId: string) => {
    setEditUserPassword({ userId, password: "" });
  };

  const handleSavePassword = async () => {
    if (!editUserPassword) return;
    
    try {
      await mockAuthService.updateUserPassword(
        editUserPassword.userId,
        editUserPassword.password
      );
      
      toast({
        title: "Passwort zurückgesetzt",
        description: "Das Passwort wurde erfolgreich zurückgesetzt.",
      });
      
      setEditUserPassword(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Fehler",
        description: "Das Passwort konnte nicht zurückgesetzt werden.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = (userId: string) => {
    setDeleteUserId(userId);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await mockAuthService.deleteUser(deleteUserId);
      
      // Update local data
      const updatedUsers = allUsers.filter(u => u.id !== deleteUserId);
      setAllUsers(updatedUsers);
      setSearchResults(searchResults.filter(u => u.id !== deleteUserId));
      
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
      
      setDeleteUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Fehler",
        description: "Der Benutzer konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-10">
          <div className="container mx-auto px-4">
            <div className="text-center">Laden...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <p className="text-gray-600 mb-6">
            Willkommen in deinem persönlichen Dashboard, {user?.username}.
          </p>
          
          {user?.isAdmin && (
            <div className="mb-8">
              <Button 
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="bg-betclever-gold hover:bg-betclever-gold/90 mb-4"
              >
                {showAdminPanel ? "Dashboard anzeigen" : "Accounts verwalten"}
              </Button>
              
              {showAdminPanel && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Benutzerverwaltung</h2>
                  
                  <div className="flex gap-2 mb-6">
                    <Input
                      placeholder="Nach Benutzername oder E-Mail suchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className="bg-betclever-gold hover:bg-betclever-gold/90"
                    >
                      {searchLoading ? "Suche..." : <Search size={20} />}
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Benutzername</TableHead>
                          <TableHead>E-Mail</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Keine Benutzer gefunden
                            </TableCell>
                          </TableRow>
                        ) : (
                          searchResults.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.isAdmin ? "Ja" : "Nein"}
                              </TableCell>
                              <TableCell className="text-right space-x-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(user)}
                                  title="Bearbeiten"
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleResetPassword(user.id)}
                                  title="Passwort zurücksetzen"
                                >
                                  <KeyRound size={16} />
                                </Button>
                                {user.id !== "admin-id" && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteConfirm(user.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Löschen"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!showAdminPanel && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <UserCircle className="h-8 w-8 text-betclever-gold" />
                  <h2 className="text-xl font-semibold">Profil</h2>
                </div>
                <p className="text-gray-600">
                  <strong>Benutzername:</strong> {user?.username}
                </p>
                <p className="text-gray-600">
                  <strong>E-Mail:</strong> {user?.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Informationen des Benutzers.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Benutzername</label>
                <Input
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <Input
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              {editUser.id !== "admin-id" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={editUser.isAdmin}
                    onChange={(e) =>
                      setEditUser({ ...editUser, isAdmin: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-betclever-gold focus:ring-betclever-gold"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium">
                    Admin-Rechte
                  </label>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUser(null)}
            >
              Abbrechen
            </Button>
            <Button
              className="bg-betclever-gold hover:bg-betclever-gold/90"
              onClick={handleSaveEdit}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={!!editUserPassword} onOpenChange={(open) => !open && setEditUserPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passwort zurücksetzen</DialogTitle>
            <DialogDescription>
              Setze ein neues Passwort für diesen Benutzer.
            </DialogDescription>
          </DialogHeader>
          {editUserPassword && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Neues Passwort</label>
                <Input
                  type="password"
                  value={editUserPassword.password}
                  onChange={(e) =>
                    setEditUserPassword({
                      ...editUserPassword,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUserPassword(null)}
            >
              Abbrechen
            </Button>
            <Button
              className="bg-betclever-gold hover:bg-betclever-gold/90"
              onClick={handleSavePassword}
              disabled={!editUserPassword?.password}
            >
              Passwort zurücksetzen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du diesen Benutzer löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUserId(null)}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
