import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Permission = {
  id: number;
  name: string;
  category?: string;
};

type GroupedPermissions = {
  category: string;
  permissions: Permission[];
};

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<number[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await fetch(`http://localhost:8000/api/users/${id}`);
        const userData = await resUser.json();

        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });

        const [allPermsRes, userPermsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/permissions`),
          fetch(`http://localhost:8000/api/users/${id}/permissions`),
        ]);

        const allPerms = await allPermsRes.json();
        const userPerms = await userPermsRes.json();

        setPermissions(allPerms);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUserPermissions(userPerms.map((p: any) => p.id));
      } catch {
        toast.error("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [id]);

  const togglePermission = async (permissionId: number, enabled: boolean, silent = false) => {
    try {
      await fetch(`http://localhost:8000/api/users/${id}/permissions`, {
        method: enabled ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_id: permissionId }),
      });

      if (!silent) toast.success("Permission mise à jour");

      setUserPermissions((prev) =>
        enabled ? [...prev, permissionId] : prev.filter((pid) => pid !== permissionId)
      );
    } catch {
      if (!silent) toast.error("Erreur de mise à jour");
    }
  };

  const handleSelectAll = async () => {
    permissions.forEach((perm) => {
      if (!userPermissions.includes(perm.id)) togglePermission(perm.id, true, true);
    });
    toast.success("Toutes les permissions activées");
  };

  const handleDeselectAll = async () => {
    userPermissions.forEach((pid) => togglePermission(pid, false, true));
    toast.success("Toutes les permissions désactivées");
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Utilisateur supprimé");
      navigate("/admin-utilisateurs");
    } catch {
      toast.error("Échec de la suppression");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleUpdateUser = async () => {
    if (password !== passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    if (password.length > 0) {
      payload.password = password;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setUser(updated);
      toast.success("Utilisateur mis à jour");
      setShowEditForm(false);
      setPassword("");
      setPasswordConfirm("");
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  const groupPermissions = (): GroupedPermissions[] => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((perm) => {
      const category = perm.category || "Autres";
      if (!groups[category]) groups[category] = [];
      groups[category].push(perm);
    });

    return Object.entries(groups).map(([category, perms]) => ({ category, permissions: perms }));
  };

  if (!user) return <p className="p-6">Chargement...</p>;

  return (
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Infos utilisateur */}
        <div className="lg:col-span-1 space-y-4">
          <section className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-lg font-semibold">Informations de l'utilisateur</h2>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditForm(!showEditForm)}>
                  {showEditForm ? "Annuler" : "Modifier"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setOpenDialog(true)}>
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Téléphone :</strong> {user.phone || "-"}</p>
              <p><strong>Créé le :</strong> {new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          </section>

          {/* Formulaire édition */}
          {showEditForm && (
            <section className="border rounded p-4 bg-white shadow-sm">
              <h3 className="text-md font-semibold mb-4">Modifier l'utilisateur</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <hr />

                <Input
                  type="password"
                  placeholder="Nouveau mot de passe (optionnel)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                {password !== passwordConfirm && passwordConfirm.length > 0 && (
                  <p className="text-red-500 text-sm">
                    ⚠️ Les mots de passe ne correspondent pas.
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateUser}>Enregistrer</Button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2 space-y-4">
          <section className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Permissions</h2>
                <Badge variant="secondary">{userPermissions.length}</Badge>
              </div>
              <div className="space-x-2">
                <Button size="sm" onClick={handleSelectAll}>Tout activer</Button>
                <Button size="sm" variant="outline" onClick={handleDeselectAll}>
                  Tout désactiver
                </Button>
              </div>
            </div>

            {groupPermissions().map((group) => (
              <div key={group.category} className="mb-6">
                <h4 className="text-md font-semibold mb-2">{group.category}</h4>
                <div className="space-y-1">
                  {group.permissions.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex justify-between items-center border rounded px-3 py-2 bg-gray-50"
                    >
                      <span>{perm.name}</span>
                      <Switch
                        checked={userPermissions.includes(perm.id)}
                        onCheckedChange={(checked) => togglePermission(perm.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Dialog Suppression */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer l'utilisateur ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive. Voulez-vous vraiment supprimer{" "}
              <strong>{user.name}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
