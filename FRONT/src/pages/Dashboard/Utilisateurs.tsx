/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";

/* ================= API (CORRIGÉ) ================= */
// 🔴 API Laravel sous /api
const API = "https://sinmat.ma/api";

/* ================= TYPES ================= */
type Permission = {
  id: number;
  name: string;
  code: string;
  category?: string;
};

export default function Utilisateurs() {
  /* ================= STATES ================= */
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<number[]>([]);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

  const [userToEdit, setUserToEdit] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [editPassword, setEditPassword] = useState("");
  const [editConfirm, setEditConfirm] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement utilisateurs");
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${API}/permissions`);
      const data = await res.json();
      setPermissions(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement permissions");
    }
  };

  const fetchUserPermissions = async (userId: number) => {
    try {
      const res = await fetch(`${API}/users/${userId}/permissions`);
      const data = await res.json();
      setUserPermissions(data.map((p: any) => p.id));
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement permissions utilisateur");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  /* ================= CREATE USER ================= */
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Champs obligatoires manquants");
      return;
    }

    if (newUser.password !== newUser.confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error();

      toast.success("Utilisateur créé");
      setOpenCreateDialog(false);
      setNewUser({ name: "", email: "", phone: "", password: "", confirm: "" });
      fetchUsers();
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  /* ================= UPDATE USER ================= */
  const handleUpdateUser = async () => {
    if (editPassword && editPassword !== editConfirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const payload: any = {
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
    };

    if (editPassword) payload.password = editPassword;

    try {
      const res = await fetch(`${API}/users/${userToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Utilisateur mis à jour");
      setOpenEditDialog(false);
      setEditPassword("");
      setEditConfirm("");
      fetchUsers();
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API}/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Utilisateur supprimé");
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch {
      toast.error("Erreur de suppression");
    }
  };

  /* ================= TOGGLE PERMISSION ================= */
  const togglePermission = async (permissionId: number, enabled: boolean) => {
    try {
      await fetch(`${API}/users/${selectedUser.id}/permissions`, {
        method: enabled ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_id: permissionId }),
      });

      setUserPermissions((prev) =>
        enabled ? [...prev, permissionId] : prev.filter((p) => p !== permissionId)
      );
    } catch {
      toast.error("Erreur permission");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>

        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouvel utilisateur
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input placeholder="Nom" value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              <Input placeholder="Email" value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Input placeholder="Téléphone" value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
              <Input type="password" placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <Input type="password" placeholder="Confirmation"
                value={newUser.confirm}
                onChange={(e) => setNewUser({ ...newUser, confirm: e.target.value })} />
            </div>

            <Button className="w-full mt-4" onClick={handleCreateUser}>
              Créer
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* USERS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setUserToEdit(u);
                      setOpenEditDialog(true);
                    }}>
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => {
                      setUserToDelete(u);
                      setOpenDeleteDialog(true);
                    }}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => {
                      setSelectedUser(u);
                      fetchUserPermissions(u.id);
                      setOpenPermissionDialog(true);
                    }}>
                      <Shield className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG PERMISSIONS */}
      <Dialog open={openPermissionDialog} onOpenChange={setOpenPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permissions de {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Gérer les autorisations de <strong>{selectedUser?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{perm.name}</span>
                <Switch
                  checked={userPermissions.includes(perm.id)}
                  onCheckedChange={(checked) =>
                    togglePermission(perm.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
