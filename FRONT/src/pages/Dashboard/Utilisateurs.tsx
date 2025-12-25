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

/* ================= API ================= */
const API = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
type Permission = {
  id: number;
  name: string;
  code: string;
  category?: string;
};

export default function Utilisateurs() {
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

  const [newPermission, setNewPermission] = useState({
    name: "",
    code: "",
    category: "",
  });

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    const res = await fetch(`${API}/users`);
    setUsers(await res.json());
  };

  const fetchPermissions = async () => {
    const res = await fetch(`${API}/permissions`);
    setPermissions(await res.json());
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

  /* ================= GROUP PERMISSIONS ================= */
  const permissionsByCategory = permissions.reduce(
    (acc: Record<string, Permission[]>, p) => {
      const cat = p.category || "Autres";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    },
    {}
  );

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
                  <TableCell>
                    <Link to={`/utilisateurs/${u.id}`} className="text-blue-600 hover:underline">
                      {u.name}
                    </Link>
                  </TableCell>
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

   {/* Permissions groupées par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(permissionsByCategory).map(([category, perms]) => (
          <Card key={category}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{category}</CardTitle>
              <div className="flex gap-1">
                <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setCategoryToAddTo(category); // Définir la catégorie à pré-remplir
        setNewPermission({
          name: "",
          code: "",
          category: category, // Pré-remplir
        });
        setOpenPermissionDialog(true); // Ouvre le formulaire
      }}
      title="Ajouter une permission"
    >
      <Plus className="h-4 w-4 text-green-600" />
    </Button>
<Button
  variant="ghost"
  size="icon"
  onClick={() => {
    setEditingCategory(category); // ancien
    setNewCategoryName(category); // valeur pré-remplie
  }}
  title="Modifier catégorie"
>
  <Edit className="h-4 w-4 text-blue-600" />
</Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingCategory(category)}
                  title="Supprimer catégorie"
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {perms.map((perm) => (
                <div
                  key={perm.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{perm.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingPermission(perm)}
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingPermission(perm)}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog
        open={!!editingPermission}
        onOpenChange={() => setEditingPermission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la permission</DialogTitle>
          </DialogHeader>

          {editingPermission && (
            <div className="space-y-4">
              <Label>Nom</Label>
              <Input
                value={editingPermission.name}
                onChange={(e) =>
                  setEditingPermission({
                    ...editingPermission,
                    name: e.target.value,
                  })
                }
              />
              <Label>Code</Label>
              <Input
                value={editingPermission.code}
                onChange={(e) =>
                  setEditingPermission({
                    ...editingPermission,
                    code: e.target.value,
                  })
                }
              />
              <Label>Catégorie</Label>
              <Input
                value={editingPermission.category || ""}
                onChange={(e) =>
                  setEditingPermission({
                    ...editingPermission,
                    category: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingPermission(null)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:8000/api/permissions/${editingPermission.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(editingPermission),
                        }
                      );
                      if (!res.ok) throw new Error();
                      toast.success("Permission modifiée");
                      setEditingPermission(null);
                      const refreshed = await fetch(
                        "http://localhost:8000/api/permissions"
                      );
                      setPermissions(await refreshed.json());
                    } catch {
                      toast.error("Erreur lors de la modification");
                    }
                  }}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deletingPermission}
        onOpenChange={() => setDeletingPermission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer la permission ?
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la permission :{" "}
              <strong>{deletingPermission?.name}</strong> ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingPermission(null)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:8000/api/permissions/${deletingPermission?.id}`,
                    {
                      method: "DELETE",
                    }
                  );
                  if (!res.ok) throw new Error();
                  toast.success("Permission supprimée");
                  setDeletingPermission(null);
                  const refreshed = await fetch(
                    "http://localhost:8000/api/permissions"
                  );
                  setPermissions(await refreshed.json());
                } catch {
                  toast.error("Erreur lors de la suppression");
                }
              }}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer la catégorie ?
            </DialogTitle>
            <DialogDescription>
              Cela supprimera <strong>toutes</strong> les permissions dans la
              catégorie : <strong>{deletingCategory}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const toDelete = permissions.filter(
                    (p) => p.category === deletingCategory
                  );
                  await Promise.all(
                    toDelete.map((p) =>
                      fetch(`http://localhost:8000/api/permissions/${p.id}`, {
                        method: "DELETE",
                      })
                    )
                  );
                  toast.success("Catégorie supprimée avec ses permissions");
                  setDeletingCategory(null);
                  const refreshed = await fetch(
                    "http://localhost:8000/api/permissions"
                  );
                  setPermissions(await refreshed.json());
                } catch {
                  toast.error("Erreur lors de la suppression de la catégorie");
                }
              }}
            >
              Supprimer tout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permissions de {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Gérer les autorisations de l'utilisateur :{" "}
              <strong>{selectedUser?.email}</strong>
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
                    handleTogglePermission(perm.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nom */}
            <Input
              placeholder="Nom"
              value={userToEdit?.name || ""}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, name: e.target.value })
              }
            />

            {/* Email */}
            <Input
              placeholder="Email"
              value={userToEdit?.email || ""}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, email: e.target.value })
              }
            />

            {/* Téléphone */}
            <Input
              placeholder="Téléphone"
              value={userToEdit?.phone || ""}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, phone: e.target.value })
              }
            />

            <hr className="my-2" />

            {/* Nouveau Mot de passe */}
            <Input
              type="password"
              placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />

            {/* Confirmation */}
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={editConfirm}
              onChange={(e) => setEditConfirm(e.target.value)}
            />

            {/* Alerte mot de passe */}
            {editPassword !== editConfirm && editConfirm.length > 0 && (
              <p className="text-red-500 text-sm">
                ⚠️ Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateUser}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
<Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modifier le nom de la catégorie</DialogTitle>
      <DialogDescription>
        Renommer la catégorie <strong>{editingCategory}</strong>.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <Label>Nouveau nom</Label>
      <Input
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
      />
    </div>

    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setEditingCategory(null)}>
        Annuler
      </Button>
      <Button
        onClick={async () => {
          try {
            const toUpdate = permissions.filter(
              (perm) => perm.category === editingCategory
            );

            await Promise.all(
              toUpdate.map((perm) =>
                fetch(`http://localhost:8000/api/permissions/${perm.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...perm, category: newCategoryName }),
                })
              )
            );

            toast.success("Catégorie renommée !");
            setEditingCategory(null);

            const refreshed = await fetch("http://localhost:8000/api/permissions");
            setPermissions(await refreshed.json());
          } catch (err) {
            console.error(err);
            toast.error("Erreur lors du renommage");
          }
        }}
      >
        Enregistrer
      </Button>
    </div>
  </DialogContent>
</Dialog>


      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer l'utilisateur ?
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{userToDelete?.name}</strong> ?
              <br />
              Cette action est <u>définitive</u>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPermissionDialog}
        onOpenChange={setOpenPermissionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une permission</DialogTitle>
            <DialogDescription>
              Ajouter une nouvelle permission personnalisée.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="perm-name">Nom</Label>
              <Input
                id="perm-name"
                placeholder="Créer utilisateurs"
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perm-code">Code</Label>
              <Input
                id="perm-code"
                placeholder="create_users"
                value={newPermission.code}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, code: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perm-category">Catégorie</Label>
              <Input
                id="perm-category"
                placeholder="Utilisateurs"
                value={newPermission.category}
                onChange={(e) => {
                  console.log("Category tapée :", e.target.value);
                  setNewPermission({
                    ...newPermission,
                    category: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenPermissionDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!newPermission.name || !newPermission.code) {
                  toast.error("Nom et code requis");
                  return;
                }

                try {
                  const res = await fetch(
                    "http://localhost:8000/api/permissions",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(newPermission),
                    }
                  );

                  if (!res.ok) throw new Error("Erreur");

                  toast.success("Permission créée !");
                  setNewPermission({ name: "", code: "", category: "" });
                  setOpenPermissionDialog(false);

                  // Recharge les permissions
                  if (selectedUser) {
                    const res = await fetch(
                      "http://localhost:8000/api/permissions"
                    );
                    setPermissions(await res.json());
                  }
                  console.log("Payload envoyé :", newPermission);
                } catch {
                  toast.error("Erreur lors de la création");
                }
              }}
            >
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

