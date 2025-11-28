import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContributorProps {
  name: string;
  bio?: string;
  role?: string;
  organization?: string;
  avatarUrl?: string;
}

const Contributor = ({ 
  name, 
  bio, 
  role, 
  organization, 
  avatarUrl 
}: ContributorProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>About the Contributor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{name}</h4>
            {bio && (
              <p className="text-sm text-muted-foreground">{bio}</p>
            )}
            {(role || organization) && (
              <p className="text-xs text-muted-foreground mt-1">
                {role ? `${role}${organization ? ' at ' : ''}` : ''}
                {organization}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contributor;